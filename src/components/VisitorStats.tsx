import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, Users } from 'lucide-react';

declare global {
  interface Window {
    busuanzi?: {
      fetch: () => void;
    };
  }
}

const VisitorStats = () => {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    siteUv: '...',
    sitePv: '...'
  });

  useEffect(() => {
    // 检查不蒜子脚本是否加载完成
    const checkBusuanzi = setInterval(() => {
      const uvElement = document.getElementById('busuanzi_value_site_uv');
      const pvElement = document.getElementById('busuanzi_value_site_pv');
      
      if (uvElement && pvElement && uvElement.textContent && pvElement.textContent) {
        setStats({
          siteUv: uvElement.textContent,
          sitePv: pvElement.textContent
        });
        setIsLoaded(true);
        clearInterval(checkBusuanzi);
      }
    }, 100);

    // 30秒后超时，避免无限等待
    const timeout = setTimeout(() => {
      clearInterval(checkBusuanzi);
      if (!isLoaded) {
        setIsLoaded(true); // 即使加载失败也显示界面
      }
    }, 30000);

    return () => {
      clearInterval(checkBusuanzi);
      clearTimeout(timeout);
    };
  }, [isLoaded]);

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-center gap-6 py-3 text-sm text-muted-foreground">
        {/* 隐藏的不蒜子元素，用于数据获取 */}
        <span style={{ display: 'none' }}>
          <span id="busuanzi_container_site_uv">
            <span id="busuanzi_value_site_uv"></span>
          </span>
          <span id="busuanzi_container_site_pv">
            <span id="busuanzi_value_site_pv"></span>
          </span>
        </span>

        {/* 显示统计信息 */}
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          <span>{t('stats.visitors')}</span>
          <span className="font-medium text-foreground">{stats.siteUv}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          <span>{t('stats.views')}</span>
          <span className="font-medium text-foreground">{stats.sitePv}</span>
        </div>
      </div>
    </div>
  );
};

export default VisitorStats;
