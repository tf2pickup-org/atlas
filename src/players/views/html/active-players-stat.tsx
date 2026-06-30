import { getActivePlayerCount } from '../../get-active-player-count'

export async function ActivePlayersStat() {
  const count = await getActivePlayerCount()

  return (
    <section class="bg-abru-light-3 border-abru-light-15 mb-8 rounded-xl border p-5">
      <div class="flex flex-col gap-1">
        <h2 class="text-ash text-lg font-bold">
          <span class="tabular-nums" safe>
            {count.toLocaleString('en-US')}
          </span>{' '}
          active players
        </h2>
        <p class="text-abru-light-50 text-sm">across all pickups in the last 30 days</p>
      </div>
    </section>
  )
}
