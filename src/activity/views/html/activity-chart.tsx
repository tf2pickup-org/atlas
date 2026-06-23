import { format } from 'date-fns'
import { getActivity } from '../../get-activity'
import { activityLevel, buildWeeks, type ActivityLevel } from '../../activity-grid'

const levelClass: Record<ActivityLevel, string> = {
  0: 'bg-abru-light-5',
  1: 'bg-accent/25',
  2: 'bg-accent/45',
  3: 'bg-accent/70',
  4: 'bg-accent',
}

const weekdayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']

export async function ActivityChart() {
  const weeks = buildWeeks(new Date())
  const counts = await getActivity(weeks[0]![0]!.key)

  const total = [...counts.values()].reduce((sum, count) => sum + count, 0)

  const monthLabels = weeks.map((week, i) => {
    const month = week[0]!.date.getUTCMonth()
    const previousMonth = i > 0 ? weeks[i - 1]![0]!.date.getUTCMonth() : -1
    return month !== previousMonth ? format(week[0]!.date, 'MMM') : ''
  })

  return (
    <section class="bg-abru-light-3 border-abru-light-15 mb-8 rounded-xl border p-5">
      <div class="mb-4 flex flex-col gap-1">
        <h2 class="text-ash text-lg font-bold">
          <span class="tabular-nums" safe>
            {total.toLocaleString('en-US')}
          </span>{' '}
          games launched
        </h2>
        <p class="text-abru-light-50 text-sm">across all pickups in the last year</p>
      </div>

      <div class="flex flex-col gap-1">
        <div class="flex gap-1 pl-9">
          {monthLabels.map(label => (
            <div class="text-abru-light-50 min-w-0 flex-1 text-xs whitespace-nowrap" safe>
              {label}
            </div>
          ))}
        </div>

        <div class="flex gap-1">
          <div class="text-abru-light-50 flex w-8 flex-col gap-1 text-xs">
            {weekdayLabels.map(label => (
              <div class="flex flex-1 items-center leading-none" safe>
                {label}
              </div>
            ))}
          </div>

          {weeks.map(week => (
            <div class="flex min-w-0 flex-1 flex-col gap-1">
              {week.map(day =>
                day.inFuture ? (
                  <div class="aspect-square w-full" />
                ) : (
                  <div
                    class={`aspect-square w-full rounded-[3px] ${levelClass[activityLevel(counts.get(day.key) ?? 0)]}`}
                    title={tooltip(counts.get(day.key) ?? 0, day.date)}
                  />
                ),
              )}
            </div>
          ))}
        </div>

        <div class="text-abru-light-50 mt-1 flex items-center gap-1.5 self-end text-xs">
          Less
          {([0, 1, 2, 3, 4] as const).map(level => (
            <div class={`h-3.5 w-3.5 rounded-[3px] ${levelClass[level]}`} />
          ))}
          More
        </div>
      </div>
    </section>
  )
}

function tooltip(count: number, date: Date) {
  const games = count === 1 ? '1 game' : `${count} games`
  return `${games} on ${format(date, 'MMM d, yyyy')}`
}
