import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Animation = (): React.JSX.Element => {
  return (
    <div
      style={{
        width: 150,
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <DotLottieReact
        src="walking.lottie"
        loop
        autoplay
        style={{ width: 150, height: 150, display: 'block' }}
      />

      {/* Longer black line with smooth multi-stop fade */}
      <div
        style={{
          height: 2,           // thin line
          width: 220,          // longer line
          marginTop: 8,
          borderRadius: 1,
          backgroundColor: 'black',
          WebkitMaskImage: `
            linear-gradient(
              to right,
              transparent 0%,
              rgba(0,0,0,0.25) 10%,
              rgba(0,0,0,0.6) 20%,
              black 40%,
              black 60%,
              rgba(0,0,0,0.6) 80%,
              rgba(0,0,0,0.25) 90%,
              transparent 100%
            )
          `,
          maskImage: `
            linear-gradient(
              to right,
              transparent 0%,
              rgba(0,0,0,0.25) 10%,
              rgba(0,0,0,0.6) 20%,
              black 40%,
              black 60%,
              rgba(0,0,0,0.6) 80%,
              rgba(0,0,0,0.25) 90%,
              transparent 100%
            )
          `,
        }}
      />
    </div>
  );
};

export default Animation;
