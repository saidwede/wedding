import InvitationFlow from '../../components/InvitationFlow';

export default async function InvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InvitationFlow id={id} />;
}
