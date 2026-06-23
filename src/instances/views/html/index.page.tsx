import { Layout } from '../../../html/layout'
import { ActivityChart } from '../../../activity/views/html/activity-chart'
import { InstanceList } from './instance-list'

export function IndexPage() {
  return (
    <Layout>
      <main class="container mx-auto max-w-5xl px-4 py-10">
        <header class="mb-8 flex flex-col gap-1">
          <h1 class="text-ash text-4xl font-black">atlas</h1>
          <p class="text-abru-light-50 text-lg">online tf2pickup.org instances</p>
        </header>

        <ActivityChart />

        <div id="instances" hx-get="/instances" hx-trigger="every 30s" hx-swap="innerHTML">
          <InstanceList />
        </div>
      </main>
    </Layout>
  )
}
