import { getInstances } from '../../get-instances'
import { InstanceCard } from './instance-card'

export async function InstanceList() {
  const instances = await getInstances()

  if (instances.length === 0) {
    return <p class="text-abru-light-50 py-16 text-center text-lg">No instances online.</p>
  }

  const onlinePlayers = instances.reduce((sum, instance) => sum + instance.onlinePlayers, 0)

  return (
    <>
      {onlinePlayers > 0 ? (
        <p class="text-abru-light-50 mb-4 text-sm">
          <span class="text-ash font-bold tabular-nums">{onlinePlayers}</span>{' '}
          {onlinePlayers === 1 ? 'player' : 'players'} online
        </p>
      ) : (
        <></>
      )}
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {instances.map(instance => (
          <InstanceCard instance={instance} />
        ))}
      </div>
    </>
  )
}
