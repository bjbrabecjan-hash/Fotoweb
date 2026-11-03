import { FeedbackForm } from "@/components/FeedbackForm";

export const metadata = {
  title: "Jak se vám líbilo focení?",
  description: "Zpětná vazba po focení a vaše volba zveřejnění fotografií a recenze.",
  alternates: { canonical: "/dotaznik" },
  robots: { index: false, follow: false }
};

export default function FeedbackPage() { return <FeedbackForm />; }
