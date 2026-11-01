import type { AttackVector } from './types'

export const ATTACK_VECTORS_MOCK: AttackVector[] = [
  {
    id: 1, title: 'DDoS-атака',
    short_description: 'Распределённая атака типа «отказ в обслуживании» — перегрузка системы множеством запросов с разных источников.',
    image_url: '/mock/ddos.jpg', video_url: '/mock/ddos.mp4',
    severity: 8, discovered_year: 1999, likes_count: 3, is_liked: 0, is_mine: 0,
  },
  {
    id: 2, title: 'SQL-инъекция',
    short_description: 'Внедрение вредоносного SQL-кода через поля ввода для чтения или изменения данных в базе данных.',
    image_url: '/mock/sqli.jpg', video_url: '/mock/sqli.mp4',
    severity: 9, discovered_year: 1998, likes_count: 2, is_liked: 0, is_mine: 0,
  },
  {
    id: 3, title: 'XSS (межсайтовый скриптинг)',
    short_description: 'Внедрение вредоносного JavaScript-кода, который выполняется в браузере другого пользователя.',
    image_url: '/mock/xss.jpg', video_url: '/mock/xss.mp4',
    severity: 6, discovered_year: 2000, likes_count: 2, is_liked: 0, is_mine: 0,
  },
  {
    id: 4, title: 'Брутфорс паролей',
    short_description: 'Автоматизированный перебор комбинаций логина и пароля.',
    image_url: '/mock/bruteforce.jpg', video_url: null,
    severity: 5, discovered_year: 2003, likes_count: 1, is_liked: 0, is_mine: 0,
  },
  {
    id: 5, title: 'Фишинг',
    short_description: 'Рассылка поддельных сообщений от имени доверенных источников для кражи учётных данных.',
    image_url: '/mock/phishing.jpg', video_url: null,
    severity: 4, discovered_year: 1996, likes_count: 1, is_liked: 0, is_mine: 0,
  },
  {
    id: 8, title: 'Атака нулевого дня',
    short_description: 'Эксплуатация уязвимости, о которой ещё не знает разработчик, поэтому исправления для неё пока нет.',
    image_url: null, video_url: null,
    severity: 10, discovered_year: 2010, likes_count: 0, is_liked: 0, is_mine: 0,
  },
]
