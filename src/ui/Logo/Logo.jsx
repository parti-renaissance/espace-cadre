import PropTypes from 'prop-types'

const Logo = ({ strokeColor = 'transparent', fillColor = 'transparent', classes = '' }) => (
  <svg className={classes} xmlns="http://www.w3.org/2000/svg" fill={fillColor} stroke={strokeColor} viewBox="0 0 68 26">
    <path d="m2 21.326 1.922-1.652a5.053 5.053 0 0 0 1.82 2.124c.81.54 1.72.809 2.732.809 2.788 0 4.44-1.776 4.957-5.326L15.724 1h2.563l-2.36 16.787c-.338 2.247-1.159 4.01-2.462 5.292C12.183 24.359 10.452 25 8.272 25a7.19 7.19 0 0 1-3.743-1.045c-1.147-.697-1.99-1.573-2.529-2.63ZM32.732 19.404h-2.563L25.078 6.36l-2.563 18.27h-2.563L23.29 1h2.395l6.069 15.472L42.207 1h2.596l-3.338 23.63h-2.563L41.5 6.36l-8.767 13.044ZM62.662 24.63H47.185L50.523 1H66l-.37 2.427H52.714l-1.113 7.955h12.543l-.337 2.427H51.265l-1.18 8.393h12.914l-.337 2.427Z" />
    <path
      strokeWidth="2"
      d="m2 21.326 1.922-1.652a5.053 5.053 0 0 0 1.82 2.124c.81.54 1.72.809 2.732.809 2.788 0 4.44-1.776 4.957-5.326L15.724 1h2.563l-2.36 16.787c-.338 2.247-1.159 4.01-2.462 5.292C12.183 24.359 10.452 25 8.272 25a7.19 7.19 0 0 1-3.743-1.045c-1.147-.697-1.99-1.573-2.529-2.63ZM32.732 19.404h-2.563L25.078 6.36l-2.563 18.27h-2.563L23.29 1h2.395l6.069 15.472L42.207 1h2.596l-3.338 23.63h-2.563L41.5 6.36l-8.767 13.044ZM62.662 24.63H47.185L50.523 1H66l-.37 2.427H52.714l-1.113 7.955h12.543l-.337 2.427H51.265l-1.18 8.393h12.914l-.337 2.427Z"
    />
  </svg>
)

export const LogoLarge = ({ strokeColor = 'transparent', fillColor = 'transparent', classes = '' }) => (
  <svg
    className={classes}
    xmlns="http://www.w3.org/2000/svg"
    fill={fillColor}
    stroke={strokeColor}
    viewBox="0 0 209 34"
  >
    <path d="m2 22.298 2.01-1.73a5.29 5.29 0 0 0 1.905 2.224c.847.566 1.8.848 2.858.848 2.916 0 4.644-1.86 5.185-5.58L16.357 1h2.68l-2.469 17.59c-.353 2.354-1.21 4.203-2.575 5.545-1.34 1.342-3.151 2.013-5.432 2.013a7.513 7.513 0 0 1-3.915-1.095c-1.2-.73-2.082-1.648-2.646-2.755ZM36.724 17.565l-.071.353H23.778c-.023.118-.035.354-.035.707 0 1.6.435 2.849 1.305 3.744.894.894 2.128 1.342 3.704 1.342 2.046 0 3.821-.848 5.326-2.543l1.587 1.836c-2.022 2.096-4.432 3.144-7.23 3.144-2.258 0-4.057-.695-5.398-2.084-1.317-1.39-1.975-3.226-1.975-5.51 0-2.85.87-5.321 2.61-7.417 1.717-2.072 3.94-3.108 6.667-3.108 2.258 0 3.915.73 4.974 2.19 1.081 1.436 1.622 3.167 1.622 5.192 0 .824-.07 1.542-.211 2.154Zm-6.667-7.064c-1.435 0-2.657.46-3.669 1.378-1.01.918-1.74 2.154-2.187 3.708h10.16c.046-1.577-.306-2.814-1.059-3.708-.752-.919-1.834-1.378-3.245-1.378ZM53.665 8.453h2.54l-.282 2.083c.564-.73 1.293-1.33 2.186-1.8a6.249 6.249 0 0 1 2.893-.707c1.129 0 2.105.27 2.928.812s1.446 1.283 1.87 2.225c1.457-2.025 3.433-3.037 5.925-3.037 1.905 0 3.34.518 4.304 1.554.964 1.036 1.446 2.52 1.446 4.45 0 .777-.047 1.448-.141 2.013l-1.376 9.713h-2.61l1.446-10.278c.07-.447.106-.883.106-1.307 0-2.472-1.14-3.708-3.422-3.708-1.434 0-2.61.506-3.527 1.519-.894.989-1.47 2.401-1.728 4.238l-1.34 9.536h-2.611l1.41-10.101c.071-.518.107-1 .107-1.448 0-2.496-1.082-3.744-3.246-3.744-1.434 0-2.633.553-3.597 1.66-.965 1.083-1.576 2.566-1.835 4.45l-1.27 9.183h-2.61l2.434-17.306ZM90.049 1l-4.868 8.088H82.36L86.77 1h3.28ZM106.583 17.565l-.071.353H93.637c-.023.118-.035.354-.035.707 0 1.6.435 2.849 1.305 3.744.893.894 2.128 1.342 3.704 1.342 2.045 0 3.821-.848 5.326-2.543l1.587 1.836c-2.022 2.096-4.432 3.144-7.23 3.144-2.258 0-4.057-.695-5.398-2.084-1.317-1.39-1.975-3.226-1.975-5.51 0-2.85.87-5.321 2.61-7.417 1.717-2.072 3.94-3.108 6.667-3.108 2.257 0 3.915.73 4.974 2.19 1.081 1.436 1.622 3.167 1.622 5.192 0 .824-.07 1.542-.211 2.154Zm-6.667-7.064c-1.435 0-2.658.46-3.669 1.378-1.01.918-1.74 2.154-2.187 3.708h10.159c.047-1.577-.306-2.814-1.058-3.708-.753-.919-1.834-1.378-3.245-1.378ZM112.673 8.453h2.54l-.282 2.083c.587-.73 1.387-1.33 2.398-1.8 1.011-.472 2.034-.707 3.069-.707 1.928 0 3.445.541 4.55 1.624 1.129 1.084 1.694 2.567 1.694 4.45 0 .684-.048 1.272-.142 1.767l-1.375 9.89h-2.646l1.446-10.279c.047-.33.071-.706.071-1.13 0-1.248-.329-2.202-.988-2.86-.658-.684-1.587-1.025-2.786-1.025-1.67 0-3.046.6-4.127 1.801-1.082 1.177-1.764 2.814-2.046 4.91l-1.2 8.582h-2.61l2.434-17.306ZM129.893 29.15l1.94-1.695c1.176 2.095 2.869 3.143 5.079 3.143 1.811 0 3.281-.541 4.41-1.624 1.128-1.06 1.822-2.532 2.081-4.416l.211-1.624c-1.411 1.624-3.398 2.437-5.961 2.437-1.928 0-3.527-.73-4.797-2.19-1.27-1.483-1.905-3.25-1.905-5.298 0-2.802.905-5.145 2.716-7.029 1.811-1.883 3.951-2.825 6.42-2.825 2.375 0 4.151.942 5.326 2.825l.318-2.401h2.54L146.013 24.7c-.376 2.59-1.399 4.615-3.069 6.075-1.646 1.483-3.727 2.225-6.243 2.225-1.788 0-3.257-.436-4.41-1.307-1.128-.824-1.928-1.672-2.398-2.543Zm3.739-11.479c0 1.554.423 2.814 1.27 3.78.87.965 1.987 1.447 3.351 1.447 1.763 0 3.268-.67 4.515-2.013 1.27-1.366 1.905-3.06 1.905-5.086 0-1.577-.435-2.849-1.306-3.814-.87-.99-1.998-1.484-3.386-1.484-1.787 0-3.292.683-4.515 2.049-1.223 1.318-1.834 3.025-1.834 5.121ZM150.943 18.307c0-2.802.835-5.216 2.505-7.24 1.693-2.026 3.798-3.038 6.314-3.038 2.257 0 3.903.883 4.938 2.649l.318-2.225h2.61l-2.434 17.306h-2.61l.247-1.872c-1.364 1.507-3.14 2.26-5.327 2.26-1.928 0-3.515-.74-4.762-2.224-1.199-1.507-1.799-3.38-1.799-5.616Zm2.716 0c0 1.648.388 2.967 1.164 3.956.8.989 1.87 1.483 3.21 1.483 1.694 0 3.104-.73 4.233-2.19 1.129-1.483 1.693-3.285 1.693-5.404 0-1.648-.399-3.002-1.199-4.062-.799-1.06-1.834-1.589-3.104-1.589-1.693 0-3.116.754-4.268 2.26-1.152 1.46-1.729 3.309-1.729 5.546ZM170.265 29.15l1.94-1.695c1.176 2.095 2.869 3.143 5.079 3.143 1.811 0 3.281-.541 4.41-1.624 1.128-1.06 1.822-2.532 2.081-4.416l.211-1.624c-1.41 1.624-3.398 2.437-5.961 2.437-1.928 0-3.527-.73-4.797-2.19-1.27-1.483-1.905-3.25-1.905-5.298 0-2.802.905-5.145 2.716-7.029 1.811-1.883 3.951-2.825 6.42-2.825 2.375 0 4.151.942 5.326 2.825l.318-2.401h2.54L186.385 24.7c-.376 2.59-1.399 4.615-3.069 6.075-1.646 1.483-3.727 2.225-6.243 2.225-1.787 0-3.257-.436-4.409-1.307-1.129-.824-1.929-1.672-2.399-2.543Zm3.739-11.479c0 1.554.423 2.814 1.27 3.78.87.965 1.987 1.447 3.351 1.447 1.764 0 3.269-.67 4.515-2.013 1.27-1.366 1.905-3.06 1.905-5.086 0-1.577-.435-2.849-1.305-3.814-.871-.99-1.999-1.484-3.387-1.484-1.787 0-3.292.683-4.515 2.049-1.223 1.318-1.834 3.025-1.834 5.121ZM207.788 17.565l-.07.353h-12.875c-.024.118-.035.354-.035.707 0 1.6.435 2.849 1.305 3.744.893.894 2.128 1.342 3.703 1.342 2.046 0 3.822-.848 5.327-2.543l1.587 1.836c-2.022 2.096-4.433 3.144-7.231 3.144-2.258 0-4.057-.695-5.397-2.084-1.317-1.39-1.975-3.226-1.975-5.51 0-2.85.87-5.321 2.61-7.417 1.717-2.072 3.939-3.108 6.667-3.108 2.257 0 3.915.73 4.973 2.19 1.082 1.436 1.623 3.167 1.623 5.192 0 .824-.071 1.542-.212 2.154Zm-6.666-7.064c-1.435 0-2.658.46-3.669 1.378-1.011.918-1.74 2.154-2.187 3.708h10.159c.047-1.577-.306-2.814-1.058-3.708-.753-.919-1.834-1.378-3.245-1.378Z" />
    <path
      strokeWidth="2"
      d="m2 22.298 2.01-1.73a5.29 5.29 0 0 0 1.905 2.224c.847.566 1.8.848 2.858.848 2.916 0 4.644-1.86 5.185-5.58L16.357 1h2.68l-2.469 17.59c-.353 2.354-1.21 4.203-2.575 5.545-1.34 1.342-3.151 2.013-5.432 2.013a7.513 7.513 0 0 1-3.915-1.095c-1.2-.73-2.082-1.648-2.646-2.755ZM36.724 17.565l-.071.353H23.778c-.023.118-.035.354-.035.707 0 1.6.435 2.849 1.305 3.744.894.894 2.128 1.342 3.704 1.342 2.046 0 3.821-.848 5.326-2.543l1.587 1.836c-2.022 2.096-4.432 3.144-7.23 3.144-2.258 0-4.057-.695-5.398-2.084-1.317-1.39-1.975-3.226-1.975-5.51 0-2.85.87-5.321 2.61-7.417 1.717-2.072 3.94-3.108 6.667-3.108 2.258 0 3.915.73 4.974 2.19 1.081 1.436 1.622 3.167 1.622 5.192 0 .824-.07 1.542-.211 2.154Zm-6.667-7.064c-1.435 0-2.657.46-3.669 1.378-1.01.918-1.74 2.154-2.187 3.708h10.16c.046-1.577-.306-2.814-1.059-3.708-.752-.919-1.834-1.378-3.245-1.378ZM53.665 8.453h2.54l-.282 2.083c.564-.73 1.293-1.33 2.186-1.8a6.249 6.249 0 0 1 2.893-.707c1.129 0 2.105.27 2.928.812s1.446 1.283 1.87 2.225c1.457-2.025 3.433-3.037 5.925-3.037 1.905 0 3.34.518 4.304 1.554.964 1.036 1.446 2.52 1.446 4.45 0 .777-.047 1.448-.141 2.013l-1.376 9.713h-2.61l1.446-10.278c.07-.447.106-.883.106-1.307 0-2.472-1.14-3.708-3.422-3.708-1.434 0-2.61.506-3.527 1.519-.894.989-1.47 2.401-1.728 4.238l-1.34 9.536h-2.611l1.41-10.101c.071-.518.107-1 .107-1.448 0-2.496-1.082-3.744-3.246-3.744-1.434 0-2.633.553-3.597 1.66-.965 1.083-1.576 2.566-1.835 4.45l-1.27 9.183h-2.61l2.434-17.306ZM90.049 1l-4.868 8.088H82.36L86.77 1h3.28ZM106.583 17.565l-.071.353H93.637c-.023.118-.035.354-.035.707 0 1.6.435 2.849 1.305 3.744.893.894 2.128 1.342 3.704 1.342 2.045 0 3.821-.848 5.326-2.543l1.587 1.836c-2.022 2.096-4.432 3.144-7.23 3.144-2.258 0-4.057-.695-5.398-2.084-1.317-1.39-1.975-3.226-1.975-5.51 0-2.85.87-5.321 2.61-7.417 1.717-2.072 3.94-3.108 6.667-3.108 2.257 0 3.915.73 4.974 2.19 1.081 1.436 1.622 3.167 1.622 5.192 0 .824-.07 1.542-.211 2.154Zm-6.667-7.064c-1.435 0-2.658.46-3.669 1.378-1.01.918-1.74 2.154-2.187 3.708h10.159c.047-1.577-.306-2.814-1.058-3.708-.753-.919-1.834-1.378-3.245-1.378ZM112.673 8.453h2.54l-.282 2.083c.587-.73 1.387-1.33 2.398-1.8 1.011-.472 2.034-.707 3.069-.707 1.928 0 3.445.541 4.55 1.624 1.129 1.084 1.694 2.567 1.694 4.45 0 .684-.048 1.272-.142 1.767l-1.375 9.89h-2.646l1.446-10.279c.047-.33.071-.706.071-1.13 0-1.248-.329-2.202-.988-2.86-.658-.684-1.587-1.025-2.786-1.025-1.67 0-3.046.6-4.127 1.801-1.082 1.177-1.764 2.814-2.046 4.91l-1.2 8.582h-2.61l2.434-17.306ZM129.893 29.15l1.94-1.695c1.176 2.095 2.869 3.143 5.079 3.143 1.811 0 3.281-.541 4.41-1.624 1.128-1.06 1.822-2.532 2.081-4.416l.211-1.624c-1.411 1.624-3.398 2.437-5.961 2.437-1.928 0-3.527-.73-4.797-2.19-1.27-1.483-1.905-3.25-1.905-5.298 0-2.802.905-5.145 2.716-7.029 1.811-1.883 3.951-2.825 6.42-2.825 2.375 0 4.151.942 5.326 2.825l.318-2.401h2.54L146.013 24.7c-.376 2.59-1.399 4.615-3.069 6.075-1.646 1.483-3.727 2.225-6.243 2.225-1.788 0-3.257-.436-4.41-1.307-1.128-.824-1.928-1.672-2.398-2.543Zm3.739-11.479c0 1.554.423 2.814 1.27 3.78.87.965 1.987 1.447 3.351 1.447 1.763 0 3.268-.67 4.515-2.013 1.27-1.366 1.905-3.06 1.905-5.086 0-1.577-.435-2.849-1.306-3.814-.87-.99-1.998-1.484-3.386-1.484-1.787 0-3.292.683-4.515 2.049-1.223 1.318-1.834 3.025-1.834 5.121ZM150.943 18.307c0-2.802.835-5.216 2.505-7.24 1.693-2.026 3.798-3.038 6.314-3.038 2.257 0 3.903.883 4.938 2.649l.318-2.225h2.61l-2.434 17.306h-2.61l.247-1.872c-1.364 1.507-3.14 2.26-5.327 2.26-1.928 0-3.515-.74-4.762-2.224-1.199-1.507-1.799-3.38-1.799-5.616Zm2.716 0c0 1.648.388 2.967 1.164 3.956.8.989 1.87 1.483 3.21 1.483 1.694 0 3.104-.73 4.233-2.19 1.129-1.483 1.693-3.285 1.693-5.404 0-1.648-.399-3.002-1.199-4.062-.799-1.06-1.834-1.589-3.104-1.589-1.693 0-3.116.754-4.268 2.26-1.152 1.46-1.729 3.309-1.729 5.546ZM170.265 29.15l1.94-1.695c1.176 2.095 2.869 3.143 5.079 3.143 1.811 0 3.281-.541 4.41-1.624 1.128-1.06 1.822-2.532 2.081-4.416l.211-1.624c-1.41 1.624-3.398 2.437-5.961 2.437-1.928 0-3.527-.73-4.797-2.19-1.27-1.483-1.905-3.25-1.905-5.298 0-2.802.905-5.145 2.716-7.029 1.811-1.883 3.951-2.825 6.42-2.825 2.375 0 4.151.942 5.326 2.825l.318-2.401h2.54L186.385 24.7c-.376 2.59-1.399 4.615-3.069 6.075-1.646 1.483-3.727 2.225-6.243 2.225-1.787 0-3.257-.436-4.409-1.307-1.129-.824-1.929-1.672-2.399-2.543Zm3.739-11.479c0 1.554.423 2.814 1.27 3.78.87.965 1.987 1.447 3.351 1.447 1.764 0 3.269-.67 4.515-2.013 1.27-1.366 1.905-3.06 1.905-5.086 0-1.577-.435-2.849-1.305-3.814-.871-.99-1.999-1.484-3.387-1.484-1.787 0-3.292.683-4.515 2.049-1.223 1.318-1.834 3.025-1.834 5.121ZM207.788 17.565l-.07.353h-12.875c-.024.118-.035.354-.035.707 0 1.6.435 2.849 1.305 3.744.893.894 2.128 1.342 3.703 1.342 2.046 0 3.822-.848 5.327-2.543l1.587 1.836c-2.022 2.096-4.433 3.144-7.231 3.144-2.258 0-4.057-.695-5.397-2.084-1.317-1.39-1.975-3.226-1.975-5.51 0-2.85.87-5.321 2.61-7.417 1.717-2.072 3.939-3.108 6.667-3.108 2.257 0 3.915.73 4.973 2.19 1.082 1.436 1.623 3.167 1.623 5.192 0 .824-.071 1.542-.212 2.154Zm-6.666-7.064c-1.435 0-2.658.46-3.669 1.378-1.011.918-1.74 2.154-2.187 3.708h10.159c.047-1.577-.306-2.814-1.058-3.708-.753-.919-1.834-1.378-3.245-1.378Z"
    />
  </svg>
)

export default Logo

Logo.propTypes = {
  classes: PropTypes.string,
  fillColor: PropTypes.string,
  strokeColor: PropTypes.string,
}

LogoLarge.propTypes = {
  classes: PropTypes.string,
  fillColor: PropTypes.string,
  strokeColor: PropTypes.string,
}
