import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nataraja Awards Database | RTBPF",
    description: "ฐานข้อมูลประกาศผลรางวัลนาฏราช รวบรวมรายชื่อผู้เข้าชิงและผู้ได้รับรางวัลในแต่ละปี โดยสมาพันธ์สมาคมวิชาชีพวิทยุกระจายเสียงและวิทยุโทรทัศน์",
    openGraph: {
        title: "Nataraja Awards Database | RTBPF",
        description: "ฐานข้อมูลประกาศผลรางวัลนาฏราช รวบรวมรายชื่อผู้เข้าชิงและผู้ได้รับรางวัลในแต่ละปี",
        type: "website",
    },
};

export default function AwardsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
