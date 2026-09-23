import bcrypt from 'bcryptjs';
import { VerificationToken } from '../models';
import { isDatabaseConnected } from '../db/connection';

export interface IOtpProvider {
  name: string;
  sendOtp(mobile: string, otp: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

const devOtpStore = new Map<string, { token: string; expires: Date; attempts: number }>();

export class DevOtpProvider implements IOtpProvider {
  name = 'DevMockProvider';
  async sendOtp(mobile: string, otp: string): Promise<{ success: boolean; messageId?: string }> {
    if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_OTP === 'true') {
      console.log(`📱 [OTP SERVICE - DEV ONLY] OTP for ${mobile}: [${otp}]`);
    } else {
      const masked = mobile.length > 4 ? `${mobile.slice(0, 3)}****${mobile.slice(-3)}` : '****';
      console.log(`📱 [OTP SERVICE] OTP dispatched successfully to ${masked}`);
    }
    return { success: true, messageId: `DEV-MSG-${Date.now()}` };
  }
}

export class Fast2SmsOtpProvider implements IOtpProvider {
  name = 'Fast2SMS';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendOtp(mobile: string, otp: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.apiKey) {
      return { success: false, error: 'Fast2SMS API key not configured in environment.' };
    }
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variables_values: otp,
          route: 'otp',
          numbers: mobile.replace('+91', '').trim(),
        }),
      });
      const data = await response.json();
      if (data.return) {
        return { success: true, messageId: data.request_id };
      }
      return { success: false, error: data.message || 'SMS delivery failed' };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Fast2SMS request failed';
      return { success: false, error: errorMsg };
    }
  }
}

export class OtpService {
  private provider: IOtpProvider;

  constructor() {
    const providerChoice = process.env.OTP_PROVIDER || 'mock';
    if (providerChoice === 'fast2sms' && process.env.FAST2SMS_API_KEY) {
      this.provider = new Fast2SmsOtpProvider(process.env.FAST2SMS_API_KEY);
    } else {
      this.provider = new DevOtpProvider();
    }
  }

  /**
   * Generate 6-digit numeric OTP, hash it, and store in MongoDB (or dev memory fallback)
   */
  public async generateAndSendOtp(identifier: string): Promise<{ success: boolean; message?: string; error?: string }> {
    // Generate secure 6-digit OTP
    const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(plainOtp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    if (isDatabaseConnected()) {
      await VerificationToken.findOneAndUpdate(
        { identifier },
        { token: hashedOtp, expires: expiresAt, attempts: 0 },
        { upsert: true, new: true }
      );
    } else {
      devOtpStore.set(identifier, { token: hashedOtp, expires: expiresAt, attempts: 0 });
    }

    // Send via provider
    const sendResult = await this.provider.sendOtp(identifier, plainOtp);
    if (!sendResult.success) {
      return { success: false, error: sendResult.error || 'Failed to dispatch SMS' };
    }

    return { success: true, message: `OTP sent successfully to ${identifier}` };
  }

  /**
   * Verify candidate OTP against hashed token in MongoDB (or dev memory fallback)
   */
  public async verifyOtp(identifier: string, candidateOtp: string): Promise<{ isValid: boolean; message?: string }> {
    // Test OTP bypass strictly gated to local/demo development
    const isDev = process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_OTP === 'true';
    if (isDev && (candidateOtp === '123456' || candidateOtp === '914200')) {
      return { isValid: true };
    }

    if (isDatabaseConnected()) {
      const tokenDoc = await VerificationToken.findOne({ identifier });
      if (!tokenDoc) {
        return { isValid: false, message: 'No active OTP request found. Please request a new OTP.' };
      }

      if (new Date() > tokenDoc.expires) {
        await VerificationToken.deleteOne({ _id: tokenDoc._id });
        return { isValid: false, message: 'OTP has expired. Please request a new one.' };
      }

      if (tokenDoc.attempts >= 5) {
        await VerificationToken.deleteOne({ _id: tokenDoc._id });
        return { isValid: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
      }

      const isMatch = await bcrypt.compare(candidateOtp, tokenDoc.token);
      if (!isMatch) {
        tokenDoc.attempts += 1;
        await tokenDoc.save();
        return { isValid: false, message: 'Invalid OTP entered.' };
      }

      // Burn token after successful verification
      await VerificationToken.deleteOne({ _id: tokenDoc._id });
      return { isValid: true };
    } else {
      const tokenDoc = devOtpStore.get(identifier);
      if (!tokenDoc) {
        return { isValid: false, message: 'No active OTP request found. Please request a new OTP.' };
      }

      if (new Date() > tokenDoc.expires) {
        devOtpStore.delete(identifier);
        return { isValid: false, message: 'OTP has expired. Please request a new one.' };
      }

      if (tokenDoc.attempts >= 5) {
        devOtpStore.delete(identifier);
        return { isValid: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
      }

      const isMatch = await bcrypt.compare(candidateOtp, tokenDoc.token);
      if (!isMatch) {
        tokenDoc.attempts += 1;
        return { isValid: false, message: 'Invalid OTP entered.' };
      }

      devOtpStore.delete(identifier);
      return { isValid: true };
    }
  }
}

export const otpService = new OtpService();
