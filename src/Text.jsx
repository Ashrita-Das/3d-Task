import {
  useEffect,
  useState,
} from 'react';

import { Text } from '@react-three/drei';

const ResponsiveText = () => {
  const [fontSize, setFontSize] = useState(2);

  useEffect(() => {
    const updateFontSize = () => {
      const width = window.innerWidth;
      if (width < 480) setFontSize(0.8); 
      else if (width < 768) setFontSize(1.5); 
      else setFontSize(2); 
    };

    updateFontSize(); 
    window.addEventListener("resize", updateFontSize);
    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  return <Text fontSize={fontSize}>AdCounty</Text>;
};

export default ResponsiveText;