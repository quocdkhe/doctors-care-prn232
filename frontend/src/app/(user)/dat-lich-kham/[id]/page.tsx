import { SlotDetail as SlotDetailType } from "@/src/types/slot";
import SlotDetail from "./slot-detail";
import MainContentWrapper from "@/src/components/commons/main-content-wrapper";
import Link from "next/link";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const slot: SlotDetailType = await fetch(`${apiUrl}/api/slots/${id}`).then(
    (res) => res.json(),
  );
  return (
    <MainContentWrapper
      breadcrumbItems={[
        { title: <Link href="/">Trang chủ</Link> },
        {
          title: <Link href="/kham-chuyen-khoa">Khám chuyên khoa</Link>,
        },
        {
          title: (
            <Link href={`/kham-chuyen-khoa/${slot.specialtySlug}`}>
              {slot.specialtyName}
            </Link>
          ),
        },
        {
          title: (
            <Link
              href={`/kham-chuyen-khoa/${slot.specialtySlug}/${slot.doctorSlug}`}
            >
              {slot.doctorName}
            </Link>
          ),
        },
        { title: "Đặt lịch khám" },
      ]}
    >
      <SlotDetail slot={slot} />
    </MainContentWrapper>
  );
}
