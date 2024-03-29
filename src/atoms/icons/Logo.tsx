// Types
interface IProps {
  color?: Color;
}

// Main
const Logo = ({ color = '#000' }: IProps) => (
  <svg
    height='100%'
    viewBox='0 0 704 1082'
    xmlns='http://www.w3.org/2000/svg'
    color={color}
  >
    <g fill='currentColor'>
      <path d='M568.5 1c-40 238.4-100 409-121.5 469.5l72.5 93.999 81.5 87.5 102-184.5C637 248.5 600.5 99.5 568.5 1ZM135.5 1.5c40 238.4 100 409 121.5 469.5l-72.5 93.999-81.5 87.5-102-184.5C67 249 103.5 100 135.5 1.5ZM66 724c71.5-61 200.5-197.5 287-361.5C449 531 541.5 636.5 640 724c-24.5 34.5-270.5 338.5-287 357.5-9-9.5-268.5-331-287-357.5Z' />
    </g>
  </svg>
);

export default Logo;
