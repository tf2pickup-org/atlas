import { formatDistanceToNow } from 'date-fns'
import type { InstanceModel } from '../../../database/models/instance.model'

export function InstanceCard(props: { instance: InstanceModel }) {
  const { instance } = props
  const queueFull = instance.queue.occupied === instance.queue.capacity

  return (
    <a
      href={instance.url}
      class="bg-abru-light-5 hover:bg-abru-light-10 border-abru-light-15 flex flex-col gap-4 rounded-lg border p-5 transition-colors"
    >
      <div class="flex items-center justify-between gap-2">
        <div class="flex min-w-0 items-center gap-2.5">
          <img
            src={`/instances/favicon?url=${encodeURIComponent(instance.url)}`}
            alt=""
            class="size-6 shrink-0"
            loading="lazy"
            onerror="this.remove()"
          />
          <span class="text-ash truncate text-xl font-bold" safe>
            {instance.name}
          </span>
        </div>
        <span
          class="bg-abru-light-15 text-abru-light-70 rounded-full px-2.5 py-0.5 text-sm font-medium whitespace-nowrap"
          safe
        >
          {instance.queue.config}
        </span>
      </div>

      <div class="flex gap-6">
        <div class="flex flex-col">
          <span
            class={`text-2xl font-bold tabular-nums ${queueFull ? 'text-accent-400' : instance.queue.occupied > 0 ? 'text-ash' : ''}`}
          >
            {instance.queue.occupied}/{instance.queue.capacity}
          </span>
          <span class="text-abru-light-50 text-sm">in queue</span>
        </div>
        <div class="flex flex-col">
          <span class="text-ash text-2xl font-bold tabular-nums">{instance.onlinePlayers}</span>
          <span class="text-abru-light-50 text-sm">online</span>
        </div>
      </div>

      <div class="text-abru-light-50 flex items-center justify-between gap-2 text-sm">
        <span safe>last seen {formatDistanceToNow(instance.lastSeenAt, { addSuffix: true })}</span>
        {instance.version ? <span safe>{instance.version}</span> : <></>}
      </div>
    </a>
  )
}
