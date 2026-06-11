export function LiveGamesIndicator(props: { count: number }) {
  return (
    <span
      class="text-accent-400 flex items-center gap-1.5 text-sm font-medium whitespace-nowrap"
      title={`${props.count} live ${props.count === 1 ? 'game' : 'games'}`}
    >
      <span class="bg-accent-600/30 flex size-[14px] items-center justify-center rounded-full">
        <span class="bg-accent-600 size-[6px] rounded-full" />
      </span>
      live
    </span>
  )
}
