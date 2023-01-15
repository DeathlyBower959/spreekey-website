const Instagram: React.FC<{ color?: string; props?: any }> = ({
  color = 'white',
  props,
}) => (
  <svg
    viewBox='0 0 220 220'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    color={color}
    {...props}
  >
    <path
      d='M147 11H73c-34.242 0-62 27.758-62 62v74c0 34.242 27.758 62 62 62h74c34.242 0 62-27.758 62-62V73c0-34.242-27.758-62-62-62Z'
      stroke='currentColor'
      strokeWidth={21}
    />
    <circle cx={110} cy={110} r={45.5} stroke='currentColor' strokeWidth={19} />
    <circle cx={167.5} cy={52.5} r={12.5} fill='currentColor' />
  </svg>
)

export default Instagram
