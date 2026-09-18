import type { Title, ContentType } from '@/types';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

function poster(path: string): string {
  return `${POSTER_BASE}${path}`;
}
function backdrop(path: string): string {
  return `${BACKDROP_BASE}${path}`;
}

export const fallbackMovies: Title[] = [
  {
    id: 872585, tmdb_id: 872585, content_type: 'movie',
    title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    poster_path: poster('/8Gxv8gSFCg0M8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/fm6KqXpk3M2HNEjCZ5g4gZ3KtF0j0e8.jpg'),
    release_date: '2023-07-19', vote_average: 8.1,
    genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'History' }],
    cast: [
      { id: 1, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profile_path: null },
      { id: 2, name: 'Emily Blunt', character: 'Katherine Oppenheimer', profile_path: null },
      { id: 3, name: 'Robert Downey Jr.', character: 'Lewis Strauss', profile_path: null },
    ],
  },
  {
    id: 155, tmdb_id: 155, content_type: 'movie',
    title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and DA Harvey Dent.',
    poster_path: poster('/qJ2tW6WMUDuxyfXq5GZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/hqk5c5gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2008-07-16', vote_average: 8.5,
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }],
    cast: [
      { id: 4, name: 'Christian Bale', character: 'Bruce Wayne', profile_path: null },
      { id: 5, name: 'Heath Ledger', character: 'Joker', profile_path: null },
      { id: 6, name: 'Aaron Eckhart', character: 'Harvey Dent', profile_path: null },
    ],
  },
  {
    id: 693134, tmdb_id: 693134, content_type: 'movie',
    title: 'Dune: Part Two',
    overview: 'Paul Atreides unites with the Fremen while seeking revenge against the conspirators who destroyed his family.',
    poster_path: poster('/1pdfLvkbY9ohJlCjQH6gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2024-03-01', vote_average: 8.2,
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 878, name: 'Sci-Fi' }],
    cast: [
      { id: 7, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: null },
      { id: 8, name: 'Zendaya', character: 'Chani', profile_path: null },
      { id: 9, name: 'Rebecca Ferguson', character: 'Lady Jessica', profile_path: null },
    ],
  },
  {
    id: 569094, tmdb_id: 569094, content_type: 'movie',
    title: 'Spider-Man: Across the Spider-Verse',
    overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    poster_path: poster('/8Vt6mWEReuy4Of61njjpIhRjBZH.jpg'),
    backdrop_path: backdrop('/4Hod8KDcYJtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2023-05-31', vote_average: 8.4,
    genres: [{ id: 28, name: 'Action' }, { id: 16, name: 'Animation' }, { id: 12, name: 'Adventure' }],
    cast: [
      { id: 10, name: 'Shameik Moore', character: 'Miles Morales', profile_path: null },
      { id: 11, name: 'Hailee Steinfeld', character: 'Gwen Stacy', profile_path: null },
    ],
  },
  {
    id: 603692, tmdb_id: 603692, content_type: 'movie',
    title: 'John Wick: Chapter 4',
    overview: 'John Wick uncovers a path to defeating The High Table by taking on its most lethal enemies.',
    poster_path: poster('/vZloFAK7NmvKXq5GZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/7gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2023-03-22', vote_average: 7.6,
    genres: [{ id: 28, name: 'Action' }, { id: 53, name: 'Thriller' }],
    cast: [
      { id: 12, name: 'Keanu Reeves', character: 'John Wick', profile_path: null },
      { id: 13, name: 'Donnie Yen', character: 'Caine', profile_path: null },
    ],
  },
  {
    id: 502356, tmdb_id: 502356, content_type: 'movie',
    title: 'The Super Mario Bros. Movie',
    overview: 'A plumber named Mario travels through an underground labyrinth with his brother, Luigi, trying to save a captured princess.',
    poster_path: poster('/qNBAXBIQlnOThrVgZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/3gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2023-04-05', vote_average: 7.7,
    genres: [{ id: 16, name: 'Animation' }, { id: 12, name: 'Adventure' }, { id: 35, name: 'Comedy' }],
    cast: [
      { id: 14, name: 'Chris Pratt', character: 'Mario', profile_path: null },
      { id: 15, name: 'Anya Taylor-Joy', character: 'Princess Peach', profile_path: null },
    ],
  },
  {
    id: 76600, tmdb_id: 76600, content_type: 'movie',
    title: 'Avatar: The Way of Water',
    overview: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.',
    poster_path: poster('/t6HIqrRAclQZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/5gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2022-12-16', vote_average: 7.6,
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 878, name: 'Sci-Fi' }],
    cast: [
      { id: 16, name: 'Sam Worthington', character: 'Jake Sully', profile_path: null },
      { id: 17, name: 'Zoe Saldana', character: 'Neytiri', profile_path: null },
    ],
  },
  {
    id: 823464, tmdb_id: 823464, content_type: 'movie',
    title: 'Godzilla x Kong: The New Empire',
    overview: 'The mighty Kong and the fearsome Godzilla face off against a colossal undiscovered threat hidden within our world.',
    poster_path: poster('/z1p34vh7dEOnLDmygZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/6gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2024-03-27', vote_average: 7.2,
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }],
    cast: [
      { id: 18, name: 'Rebecca Hall', character: 'Ilene Andrews', profile_path: null },
      { id: 19, name: 'Brian Tyree Henry', character: 'Bernie Hayes', profile_path: null },
    ],
  },
];

export const fallbackTV: Title[] = [
  {
    id: 1396, tmdb_id: 1396, content_type: 'tv',
    title: 'Breaking Bad',
    overview: 'A high school chemistry teacher diagnosed with cancer turns to manufacturing and selling methamphetamine.',
    poster_path: poster('/ggFHVNu6YYI5L9pCgZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/tsRy63Mu5c8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2008-01-20', vote_average: 9.5,
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    seasons: [
      { season_number: 1, name: 'Season 1', episode_count: 7, poster_path: null, air_date: '2008-01-20', overview: 'Walter White begins cooking meth.' },
      { season_number: 2, name: 'Season 2', episode_count: 13, poster_path: null, air_date: '2009-03-08', overview: 'Walter and Jesse expand their operation.' },
      { season_number: 3, name: 'Season 3', episode_count: 13, poster_path: null, air_date: '2010-03-21', overview: 'Walter faces Gus Fring.' },
      { season_number: 4, name: 'Season 4', episode_count: 13, poster_path: null, air_date: '2011-07-17', overview: 'The conflict with Gus reaches its climax.' },
      { season_number: 5, name: 'Season 5', episode_count: 16, poster_path: null, air_date: '2012-07-15', overview: 'Walter empire crumbles.' },
    ],
    cast: [
      { id: 20, name: 'Bryan Cranston', character: 'Walter White', profile_path: null },
      { id: 21, name: 'Aaron Paul', character: 'Jesse Pinkman', profile_path: null },
      { id: 22, name: 'Anna Gunn', character: 'Skyler White', profile_path: null },
    ],
  },
  {
    id: 100088, tmdb_id: 100088, content_type: 'tv',
    title: 'The Last of Us',
    overview: 'Twenty years after a fungal outbreak destroys civilization, Joel and Ellie must survive in a post-apocalyptic world.',
    poster_path: poster('/uRYgZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2023-01-15', vote_average: 8.7,
    genres: [{ id: 18, name: 'Drama' }, { id: 10765, name: 'Sci-Fi & Fantasy' }],
    seasons: [
      { season_number: 1, name: 'Season 1', episode_count: 9, poster_path: null, air_date: '2023-01-15', overview: 'Joel and Ellie journey across a ravaged civilization.' },
    ],
    cast: [
      { id: 23, name: 'Pedro Pascal', character: 'Joel', profile_path: null },
      { id: 24, name: 'Bella Ramsey', character: 'Ellie', profile_path: null },
    ],
  },
  {
    id: 94607, tmdb_id: 94607, content_type: 'tv',
    title: 'Wednesday',
    overview: 'Wednesday Addams investigates a murderous spree at Nevermore Academy.',
    poster_path: poster('/9PFgB9bWgZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/2gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2022-11-23', vote_average: 8.5,
    genres: [{ id: 9648, name: 'Mystery' }, { id: 35, name: 'Comedy' }],
    seasons: [
      { season_number: 1, name: 'Season 1', episode_count: 8, poster_path: null, air_date: '2022-11-23', overview: 'Wednesday at Nevermore Academy.' },
    ],
    cast: [
      { id: 25, name: 'Jenna Ortega', character: 'Wednesday Addams', profile_path: null },
      { id: 26, name: 'Catherine Zeta-Jones', character: 'Morticia Addams', profile_path: null },
    ],
  },
  {
    id: 76479, tmdb_id: 76479, content_type: 'tv',
    title: 'The Boys',
    overview: 'A group of vigilantes set out to take down corrupt superheroes who abuse their abilities.',
    poster_path: poster('/2zmYgZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/9gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2019-07-25', vote_average: 8.4,
    genres: [{ id: 10759, name: 'Action & Adventure' }, { id: 18, name: 'Drama' }],
    seasons: [
      { season_number: 1, name: 'Season 1', episode_count: 8, poster_path: null, air_date: '2019-07-25', overview: 'The Boys form to fight the Supes.' },
      { season_number: 2, name: 'Season 2', episode_count: 8, poster_path: null, air_date: '2020-09-04', overview: 'The threat of Stormfront.' },
      { season_number: 3, name: 'Season 3', episode_count: 8, poster_path: null, air_date: '2022-06-03', overview: 'Soldier Boy returns.' },
      { season_number: 4, name: 'Season 4', episode_count: 8, poster_path: null, air_date: '2024-06-13', overview: 'Homelander threatens democracy.' },
    ],
    cast: [
      { id: 27, name: 'Karl Urban', character: 'Billy Butcher', profile_path: null },
      { id: 28, name: 'Antony Starr', character: 'Homelander', profile_path: null },
    ],
  },
  {
    id: 71912, tmdb_id: 71912, content_type: 'tv',
    title: 'Game of Thrones',
    overview: 'Noble families vie for control of the Iron Throne in the land of Westeros.',
    poster_path: poster('/1u5gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/4gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2011-04-17', vote_average: 8.4,
    genres: [{ id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 18, name: 'Drama' }],
    seasons: [
      { season_number: 1, name: 'Season 1', episode_count: 10, poster_path: null, air_date: '2011-04-17', overview: 'The Stark family enters the game.' },
      { season_number: 2, name: 'Season 2', episode_count: 10, poster_path: null, air_date: '2012-04-01', overview: 'The War of Five Kings.' },
      { season_number: 3, name: 'Season 3', episode_count: 10, poster_path: null, air_date: '2013-03-31', overview: 'The Red Wedding.' },
      { season_number: 4, name: 'Season 4', episode_count: 10, poster_path: null, air_date: '2014-04-06', overview: 'The Lannisters tighten their grip.' },
      { season_number: 5, name: 'Season 5', episode_count: 10, poster_path: null, air_date: '2015-04-12', overview: 'Daenerys rules Meereen.' },
      { season_number: 6, name: 'Season 6', episode_count: 10, poster_path: null, air_date: '2016-04-24', overview: 'Jon Snow is resurrected.' },
      { season_number: 7, name: 'Season 7', episode_count: 7, poster_path: null, air_date: '2017-07-16', overview: 'The Great War begins.' },
      { season_number: 8, name: 'Season 8', episode_count: 6, poster_path: null, air_date: '2019-04-14', overview: 'The final season.' },
    ],
    cast: [
      { id: 29, name: 'Emilia Clarke', character: 'Daenerys Targaryen', profile_path: null },
      { id: 30, name: 'Kit Harington', character: 'Jon Snow', profile_path: null },
    ],
  },
  {
    id: 60625, tmdb_id: 60625, content_type: 'tv',
    title: 'Peaky Blinders',
    overview: 'A gangster family epic set in 1900s England, centering on the Shelby crime family.',
    poster_path: poster('/vLNgZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/5gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2013-09-12', vote_average: 8.5,
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    seasons: [
      { season_number: 1, name: 'Season 1', episode_count: 6, poster_path: null, air_date: '2013-09-12', overview: 'Thomas Shelby leads the Peaky Blinders.' },
      { season_number: 2, name: 'Season 2', episode_count: 6, poster_path: null, air_date: '2014-10-02', overview: 'The Blinders expand to London.' },
      { season_number: 3, name: 'Season 3', episode_count: 6, poster_path: null, air_date: '2016-05-05', overview: 'The Shelbys face the Russians.' },
      { season_number: 4, name: 'Season 4', episode_count: 6, poster_path: null, air_date: '2017-11-15', overview: 'The New York Mafia comes to Birmingham.' },
      { season_number: 5, name: 'Season 5', episode_count: 6, poster_path: null, air_date: '2019-08-25', overview: 'Thomas enters politics.' },
      { season_number: 6, name: 'Season 6', episode_count: 6, poster_path: null, air_date: '2022-02-27', overview: 'The final season.' },
    ],
    cast: [
      { id: 31, name: 'Cillian Murphy', character: 'Thomas Shelby', profile_path: null },
      { id: 32, name: 'Paul Anderson', character: 'Arthur Shelby', profile_path: null },
    ],
  },
];

export const fallbackAnime: Title[] = [
  {
    id: 95479, tmdb_id: 95479, content_type: 'anime',
    title: 'Jujutsu Kaisen',
    overview: 'Yuji Itadori joins a secret organization of sorcerers to kill a powerful curse named Ryomen Sukuna.',
    poster_path: poster('/fHpKWq9ayzQgZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2020-10-02', vote_average: 8.7,
    genres: [{ id: 16, name: 'Animation' }, { id: 10759, name: 'Action & Adventure' }, { id: 18, name: 'Drama' }],
    seasons: [
      { season_number: 1, name: 'Season 1', episode_count: 24, poster_path: null, air_date: '2020-10-02', overview: 'Yuji swallows Sukuna finger and becomes his vessel.' },
      { season_number: 2, name: 'Shibuya Incident', episode_count: 23, poster_path: null, air_date: '2023-07-06', overview: 'The Shibuya Incident arc.' },
    ],
    cast: [
      { id: 33, name: 'Junya Enoki', character: 'Yuji Itadori', profile_path: null },
      { id: 34, name: 'Yuma Uchida', character: 'Megumi Fushiguro', profile_path: null },
    ],
  },
  {
    id: 85937, tmdb_id: 85937, content_type: 'anime',
    title: 'Attack on Titan',
    overview: 'After his hometown is destroyed, Eren Yeager vows to cleanse the earth of the giant humanoid Titans.',
    poster_path: poster('/hTPgZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/7gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2013-04-07', vote_average: 8.6,
    genres: [{ id: 16, name: 'Animation' }, { id: 10759, name: 'Action & Adventure' }, { id: 18, name: 'Drama' }],
    seasons: [
      { season_number: 1, name: 'Season 1', episode_count: 25, poster_path: null, air_date: '2013-04-07', overview: 'The fall of Shiganshina.' },
      { season_number: 2, name: 'Season 2', episode_count: 12, poster_path: null, air_date: '2017-04-01', overview: 'Clash of the Titans arc.' },
      { season_number: 3, name: 'Season 3', episode_count: 22, poster_path: null, air_date: '2018-07-23', overview: 'Return to Shiganshina.' },
      { season_number: 4, name: 'Final Season', episode_count: 28, poster_path: null, air_date: '2020-12-07', overview: 'The final battle for humanity.' },
    ],
    cast: [
      { id: 35, name: 'Yuki Kaji', character: 'Eren Yeager', profile_path: null },
      { id: 36, name: 'Marina Inoue', character: 'Armin Arlert', profile_path: null },
    ],
  },
  {
    id: 240707, tmdb_id: 240707, content_type: 'anime',
    title: 'Solo Leveling',
    overview: 'Sung Jinwoo, the weakest hunter, gains the ability to level up infinitely through a mysterious system.',
    poster_path: poster('/geWRgZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2024-01-07', vote_average: 8.5,
    genres: [{ id: 16, name: 'Animation' }, { id: 10759, name: 'Action & Adventure' }, { id: 10765, name: 'Sci-Fi & Fantasy' }],
    seasons: [
      { season_number: 1, name: 'Season 1', episode_count: 12, poster_path: null, air_date: '2024-01-07', overview: 'Jinwoo begins his rise from weakest to strongest.' },
    ],
    cast: [
      { id: 37, name: 'Taito Ban', character: 'Sung Jinwoo', profile_path: null },
    ],
  },
  {
    id: 142941, tmdb_id: 142941, content_type: 'anime',
    title: 'Attack on Titan: Final Season Part 3',
    overview: 'The final chapter of the epic battle between Eren Yeager and the rest of humanity.',
    poster_path: poster('/fHpKWq9ayzQgZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/9gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2023-03-04', vote_average: 8.8,
    genres: [{ id: 16, name: 'Animation' }, { id: 10759, name: 'Action & Adventure' }],
    seasons: [
      { season_number: 1, name: 'Final Season Part 3', episode_count: 2, poster_path: null, air_date: '2023-03-04', overview: 'The conclusion.' },
    ],
    cast: [
      { id: 38, name: 'Yuki Kaji', character: 'Eren Yeager', profile_path: null },
    ],
  },
  {
    id: 205821, tmdb_id: 205821, content_type: 'anime',
    title: 'Chainsaw Man',
    overview: 'Denji becomes a devil hunter with the power of a chainsaw devil dog named Pochita.',
    poster_path: poster('/npdBgZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/1gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2022-10-11', vote_average: 8.4,
    genres: [{ id: 16, name: 'Animation' }, { id: 10759, name: 'Action & Adventure' }, { id: 18, name: 'Drama' }],
    seasons: [
      { season_number: 1, name: 'Season 1', episode_count: 12, poster_path: null, air_date: '2022-10-11', overview: 'Denji joins the Devil Hunters.' },
    ],
    cast: [
      { id: 39, name: 'Kikunosuke Toya', character: 'Denji', profile_path: null },
    ],
  },
  {
    id: 210191, tmdb_id: 210191, content_type: 'anime',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    overview: 'Tanjiro Kamado becomes a demon slayer to avenge his family and cure his sister Nezuko.',
    poster_path: poster('/wrCgZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    backdrop_path: backdrop('/2gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8gZ3KtF0j0e8.jpg'),
    release_date: '2019-04-06', vote_average: 8.5,
    genres: [{ id: 16, name: 'Animation' }, { id: 10759, name: 'Action & Adventure' }],
    seasons: [
      { season_number: 1, name: 'Season 1', episode_count: 26, poster_path: null, air_date: '2019-04-06', overview: 'Tanjiro begins his journey.' },
      { season_number: 2, name: 'Entertainment District Arc', episode_count: 18, poster_path: null, air_date: '2021-12-05', overview: 'The Entertainment District arc.' },
      { season_number: 3, name: 'Swordsmith Village Arc', episode_count: 11, poster_path: null, air_date: '2023-04-09', overview: 'The Swordsmith Village arc.' },
      { season_number: 4, name: 'Hashira Training Arc', episode_count: 8, poster_path: null, air_date: '2024-05-12', overview: 'The Hashira Training arc.' },
    ],
    cast: [
      { id: 40, name: 'Natsuki Hanae', character: 'Tanjiro Kamado', profile_path: null },
    ],
  },
];

export const allFallbackTitles: Title[] = [...fallbackMovies, ...fallbackTV, ...fallbackAnime];

export function getFallbackTitles(contentType: ContentType): Title[] {
  switch (contentType) {
    case 'movie': return fallbackMovies;
    case 'tv': return fallbackTV;
    case 'anime': return fallbackAnime;
    default: return allFallbackTitles;
  }
}

export function getFallbackTrending(): Title[] {
  return [...fallbackMovies.slice(0, 4), ...fallbackTV.slice(0, 3), ...fallbackAnime.slice(0, 3)];
}

export function getFallbackById(tmdbId: number): Title | null {
  return allFallbackTitles.find(t => t.tmdb_id === tmdbId) || null;
}

export function searchFallback(query: string): Title[] {
  const q = query.toLowerCase();
  return allFallbackTitles.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.overview.toLowerCase().includes(q) ||
    t.genres?.some(g => g.name.toLowerCase().includes(q))
  );
}
