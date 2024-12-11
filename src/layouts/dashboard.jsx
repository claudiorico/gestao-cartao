import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';

export default function Layout() {
  return (
    <DashboardLayout defaultSidebarCollapsed style={{ flex: 1, border: 0 }}>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
