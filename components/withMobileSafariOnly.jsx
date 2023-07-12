import { useState, useEffect } from 'react';
import Layout from 'lib/Layout';

export default function withMobileSafariOnly(WrappedComponent) {
  return function Component(props) {
    const [isIOSMobile, setIsIOSMobile] = useState(null);

    useEffect(() => {
      const userAgent = navigator.userAgent;
      const isMobile = !!userAgent.match(/(iPad)|(iPhone)|(iPod)/i);
      const isSafari = !!userAgent.match(/Safari/i);
      setIsIOSMobile(isMobile && isSafari);
    }, []);

    if (isIOSMobile === null) {
      return <Layout loading={true} />;
    }

    if (!isIOSMobile && process.env.NODE_ENV !== 'development') {
      return <>Only available on mobile devices. Ensure you use Safari browser.</>;
    }

    return <WrappedComponent {...props} />;
  };
}
