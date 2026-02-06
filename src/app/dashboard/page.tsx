import { CreateLinkForm } from '@/components/dashboard/create-link-form';
import { LinksListTable } from '@/components/dashboard/links-list-table';
import { mockPaymentLinks } from '@/lib/mock-data';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <CreateLinkForm />
      </div>
      <div className="lg:col-span-2">
        <LinksListTable links={mockPaymentLinks} />
      </div>
    </div>
  );
}
