import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInviteEmail = async (email: string, name: string, role: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'RTBPF CMS <noreply@rtbpf.org>', // Note: Needs verified domain in Resend
            to: email,
            subject: 'Invite: เว็บไซต์สมาพันธ์ฯ (RTBPF CMS)',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #1B2A4A;">สวัสดีคุณ ${name || 'สมาชิกใหม่'}</h2>
                    <p>คุณได้รับเชิญให้เข้าร่วมใช้งานระบบจัดการเนื้อหา (CMS) ของ <strong>สมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์ (RTBPF)</strong></p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; font-weight: bold; color: #555;">รายละเอียดการเข้าใช้งาน:</p>
                        <p style="margin: 5px 0 0 0;"><strong>Username:</strong> ${email}</p>
                        <p style="margin: 5px 0 0 0;"><strong>Password:</strong> rtbpf2024</p>
                        <p style="margin: 5px 0 0 0;"><strong>Role:</strong> ${role}</p>
                    </div>
                    <p>กรุณาคลิกที่ปุ่มด้านล่างเพื่อเข้าสู่ระบบ:</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/login" style="display: inline-block; padding: 12px 24px; background-color: #C9A84C; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">เข้าสู่ระบบ CMS</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #888;">*เพื่อความปลอดภัย กรุณาเปลี่ยนรหัสผ่านทันทีหลังจากการเข้าสู่ระบบครั้งแรก</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 10px; color: #aaa; text-align: center;">© 2024 RTBPF. All rights reserved.</p>
                </div>
            `,
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (e) {
        console.error("Mail Error:", e);
        return { success: false, error: e };
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: 'RTBPF CMS <noreply@rtbpf.org>',
            to: email,
            subject: 'Reset Password: กู้คืนรหัสผ่าน RTBPF CMS',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #1B2A4A;">กู้คืนรหัสผ่าน</h2>
                    <p>เราได้รับคำขอให้รีเซ็ตรหัสผ่านสำหรับบัญชีของคุณที่เชื่อมโยงกับอีเมล ${email}</p>
                    <p>หากคุณเป็นคนร้องขอ กรุณาคลิกที่ปุ่มด้านล่างเพื่อกำหนดรหัสผ่านใหม่:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #C9A84C; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">รีเซ็ตรหัสผ่าน</a>
                    </div>
                    <p style="color: #666; font-size: 14px;"><strong>ลิงก์นี้จะมีอายุการใช้งาน 1 ชั่วโมง</strong></p>
                    <p style="color: #888; font-size: 12px;">หากคุณไม่ได้เป็นผู้ขอรีเซ็ตรหัสผ่าน กรุณาไขเพิกเฉยต่ออีเมลฉบับนี้</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 10px; color: #aaa; text-align: center;">© 2024 RTBPF. All rights reserved.</p>
                </div>
            `,
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (e) {
        console.error("Mail Error:", e);
        return { success: false, error: e };
    }
};
