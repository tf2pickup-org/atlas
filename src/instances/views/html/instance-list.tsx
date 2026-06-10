import { getInstances } from '../../get-instances'
import { InstanceCard } from './instance-card'

export async function InstanceList() {
  const instances = await getInstances()

  if (instances.length === 0) {
    return <p class="text-abru-light-50 py-16 text-center text-lg">No instances online.</p>
  }

  return (
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {instances.map(instance => (
        <InstanceCard instance={instance} />
      ))}
    </div>
  )
}
