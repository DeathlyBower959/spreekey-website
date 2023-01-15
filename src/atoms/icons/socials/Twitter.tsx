const Twitter: React.FC<{ color?: string; props?: any }> = ({
  color = '#1D9BF0',
  props,
}) => (
  <svg
    viewBox='0 0 236 191'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    color={color}
    {...props}
  >
    <path
      d='M21.164 15.585c29.846 32.449 69.446 42.486 90.305 43.77 2.236.137 3.874.227 4.334-1.966.045-.215.196-1.014.197-1.234.221-81.572 79.006-52.139 82.999-40.655.927 2.162 13.397-4.833 22.501-8.848 5.635-2.485 9.981-3.829 9.499-1.152C228.5 16 205.5 29 208.999 30c11 3.5 29-12 26.5-5.5-3.077 8-22.731 19.5-23 26C195.097 234.959 26.283 190.029 1.819 175.243c-4.07-2.46 2.019-3.037 6.774-2.926 20.564.481 53.353-11.723 61.639-17.964 2.549-1.92-.85-3.434-3.993-3.984-29.769-5.21-44.018-31.894-39.74-32.369 4.5-.5 45.5.5 19-2-28.5-1.5-46-53-34-47.5s22 8 18 4.5C7.817 56.65 7.866 26.4 11.143 13.69c1.438-5.577 6.122-2.345 10.02 1.894Z'
      fill='currentColor'
    />
  </svg>
)

export default Twitter
