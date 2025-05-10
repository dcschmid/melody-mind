-- Migration: Add Achievement Translations
-- Description: Adds translations for all achievements in all supported languages (de, en, fr, es, it, pt, da, nl, sv, fi)

-- =============================================
-- Games Played Achievements (Spielzähler-Achievements)
-- =============================================

-- German (de)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_games_1', 'de', 'Anfänger: 1 Spiel', 'Spiele dein erstes Spiel in einem beliebigen Modus'),
('ach_games_5', 'de', 'Anfänger: 5 Spiele', 'Spiele 5 Partien in einem beliebigen Modus'),
('ach_games_10', 'de', 'Anfänger: 10 Spiele', 'Spiele 10 Partien in einem beliebigen Modus'),
('ach_games_25', 'de', 'Amateur: 25 Spiele', 'Spiele 25 Partien in einem beliebigen Modus'),
('ach_games_50', 'de', 'Amateur: 50 Spiele', 'Spiele 50 Partien in einem beliebigen Modus'),
('ach_games_75', 'de', 'Amateur: 75 Spiele', 'Spiele 75 Partien in einem beliebigen Modus'),
('ach_games_100', 'de', 'Fortgeschritten: 100 Spiele', 'Spiele 100 Partien in einem beliebigen Modus'),
('ach_games_150', 'de', 'Fortgeschritten: 150 Spiele', 'Spiele 150 Partien in einem beliebigen Modus'),
('ach_games_200', 'de', 'Fortgeschritten: 200 Spiele', 'Spiele 200 Partien in einem beliebigen Modus'),
('ach_games_300', 'de', 'Experte: 300 Spiele', 'Spiele 300 Partien in einem beliebigen Modus'),
('ach_games_400', 'de', 'Experte: 400 Spiele', 'Spiele 400 Partien in einem beliebigen Modus'),
('ach_games_500', 'de', 'Experte: 500 Spiele', 'Spiele 500 Partien in einem beliebigen Modus'),
('ach_games_750', 'de', 'Meister: 750 Spiele', 'Spiele 750 Partien in einem beliebigen Modus'),
('ach_games_1000', 'de', 'Meister: 1000 Spiele', 'Spiele 1000 Partien in einem beliebigen Modus'),
('ach_games_1500', 'de', 'Meister: 1500 Spiele', 'Spiele 1500 Partien in einem beliebigen Modus'),
('ach_games_2000', 'de', 'Meister: 2000 Spiele', 'Spiele 2000 Partien in einem beliebigen Modus'),
('ach_games_2500', 'de', 'Legende: 2500 Spiele', 'Spiele 2500 Partien in einem beliebigen Modus'),
('ach_games_3000', 'de', 'Legende: 3000 Spiele', 'Spiele 3000 Partien in einem beliebigen Modus'),
('ach_games_4000', 'de', 'Legende: 4000 Spiele', 'Spiele 4000 Partien in einem beliebigen Modus'),
('ach_games_5000', 'de', 'Legende: 5000 Spiele', 'Spiele 5000 Partien in einem beliebigen Modus');

-- English (en)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_games_1', 'en', 'Beginner: 1 Game', 'Play your first game in any mode'),
('ach_games_5', 'en', 'Beginner: 5 Games', 'Play 5 games in any mode'),
('ach_games_10', 'en', 'Beginner: 10 Games', 'Play 10 games in any mode'),
('ach_games_25', 'en', 'Amateur: 25 Games', 'Play 25 games in any mode'),
('ach_games_50', 'en', 'Amateur: 50 Games', 'Play 50 games in any mode'),
('ach_games_75', 'en', 'Amateur: 75 Games', 'Play 75 games in any mode'),
('ach_games_100', 'en', 'Advanced: 100 Games', 'Play 100 games in any mode'),
('ach_games_150', 'en', 'Advanced: 150 Games', 'Play 150 games in any mode'),
('ach_games_200', 'en', 'Advanced: 200 Games', 'Play 200 games in any mode'),
('ach_games_300', 'en', 'Expert: 300 Games', 'Play 300 games in any mode'),
('ach_games_400', 'en', 'Expert: 400 Games', 'Play 400 games in any mode'),
('ach_games_500', 'en', 'Expert: 500 Games', 'Play 500 games in any mode'),
('ach_games_750', 'en', 'Master: 750 Games', 'Play 750 games in any mode'),
('ach_games_1000', 'en', 'Master: 1000 Games', 'Play 1000 games in any mode'),
('ach_games_1500', 'en', 'Master: 1500 Games', 'Play 1500 games in any mode'),
('ach_games_2000', 'en', 'Master: 2000 Games', 'Play 2000 games in any mode'),
('ach_games_2500', 'en', 'Legend: 2500 Games', 'Play 2500 games in any mode'),
('ach_games_3000', 'en', 'Legend: 3000 Games', 'Play 3000 games in any mode'),
('ach_games_4000', 'en', 'Legend: 4000 Games', 'Play 4000 games in any mode'),
('ach_games_5000', 'en', 'Legend: 5000 Games', 'Play 5000 games in any mode');

-- French (fr)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_games_1', 'fr', 'Débutant: 1 Partie', 'Jouez votre première partie dans n''importe quel mode'),
('ach_games_5', 'fr', 'Débutant: 5 Parties', 'Jouez 5 parties dans n''importe quel mode'),
('ach_games_10', 'fr', 'Débutant: 10 Parties', 'Jouez 10 parties dans n''importe quel mode'),
('ach_games_25', 'fr', 'Amateur: 25 Parties', 'Jouez 25 parties dans n''importe quel mode'),
('ach_games_50', 'fr', 'Amateur: 50 Parties', 'Jouez 50 parties dans n''importe quel mode'),
('ach_games_75', 'fr', 'Amateur: 75 Parties', 'Jouez 75 parties dans n''importe quel mode'),
('ach_games_100', 'fr', 'Avancé: 100 Parties', 'Jouez 100 parties dans n''importe quel mode'),
('ach_games_150', 'fr', 'Avancé: 150 Parties', 'Jouez 150 parties dans n''importe quel mode'),
('ach_games_200', 'fr', 'Avancé: 200 Parties', 'Jouez 200 parties dans n''importe quel mode'),
('ach_games_300', 'fr', 'Expert: 300 Parties', 'Jouez 300 parties dans n''importe quel mode'),
('ach_games_400', 'fr', 'Expert: 400 Parties', 'Jouez 400 parties dans n''importe quel mode'),
('ach_games_500', 'fr', 'Expert: 500 Parties', 'Jouez 500 parties dans n''importe quel mode'),
('ach_games_750', 'fr', 'Maître: 750 Parties', 'Jouez 750 parties dans n''importe quel mode'),
('ach_games_1000', 'fr', 'Maître: 1000 Parties', 'Jouez 1000 parties dans n''importe quel mode'),
('ach_games_1500', 'fr', 'Maître: 1500 Parties', 'Jouez 1500 parties dans n''importe quel mode'),
('ach_games_2000', 'fr', 'Maître: 2000 Parties', 'Jouez 2000 parties dans n''importe quel mode'),
('ach_games_2500', 'fr', 'Légende: 2500 Parties', 'Jouez 2500 parties dans n''importe quel mode'),
('ach_games_3000', 'fr', 'Légende: 3000 Parties', 'Jouez 3000 parties dans n''importe quel mode'),
('ach_games_4000', 'fr', 'Légende: 4000 Parties', 'Jouez 4000 parties dans n''importe quel mode'),
('ach_games_5000', 'fr', 'Légende: 5000 Parties', 'Jouez 5000 parties dans n''importe quel mode');

-- Spanish (es)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_games_1', 'es', 'Principiante: 1 Juego', 'Juega tu primer juego en cualquier modo'),
('ach_games_5', 'es', 'Principiante: 5 Juegos', 'Juega 5 partidas en cualquier modo'),
('ach_games_10', 'es', 'Principiante: 10 Juegos', 'Juega 10 partidas en cualquier modo'),
('ach_games_25', 'es', 'Aficionado: 25 Juegos', 'Juega 25 partidas en cualquier modo'),
('ach_games_50', 'es', 'Aficionado: 50 Juegos', 'Juega 50 partidas en cualquier modo'),
('ach_games_75', 'es', 'Aficionado: 75 Juegos', 'Juega 75 partidas en cualquier modo'),
('ach_games_100', 'es', 'Avanzado: 100 Juegos', 'Juega 100 partidas en cualquier modo'),
('ach_games_150', 'es', 'Avanzado: 150 Juegos', 'Juega 150 partidas en cualquier modo'),
('ach_games_200', 'es', 'Avanzado: 200 Juegos', 'Juega 200 partidas en cualquier modo'),
('ach_games_300', 'es', 'Experto: 300 Juegos', 'Juega 300 partidas en cualquier modo'),
('ach_games_400', 'es', 'Experto: 400 Juegos', 'Juega 400 partidas en cualquier modo'),
('ach_games_500', 'es', 'Experto: 500 Juegos', 'Juega 500 partidas en cualquier modo'),
('ach_games_750', 'es', 'Maestro: 750 Juegos', 'Juega 750 partidas en cualquier modo'),
('ach_games_1000', 'es', 'Maestro: 1000 Juegos', 'Juega 1000 partidas en cualquier modo'),
('ach_games_1500', 'es', 'Maestro: 1500 Juegos', 'Juega 1500 partidas en cualquier modo'),
('ach_games_2000', 'es', 'Maestro: 2000 Juegos', 'Juega 2000 partidas en cualquier modo'),
('ach_games_2500', 'es', 'Leyenda: 2500 Juegos', 'Juega 2500 partidas en cualquier modo'),
('ach_games_3000', 'es', 'Leyenda: 3000 Juegos', 'Juega 3000 partidas en cualquier modo'),
('ach_games_4000', 'es', 'Leyenda: 4000 Juegos', 'Juega 4000 partidas en cualquier modo'),
('ach_games_5000', 'es', 'Leyenda: 5000 Juegos', 'Juega 5000 partidas en cualquier modo');

-- Italian (it)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_games_1', 'it', 'Principiante: 1 Partita', 'Gioca la tua prima partita in qualsiasi modalità'),
('ach_games_5', 'it', 'Principiante: 5 Partite', 'Gioca 5 partite in qualsiasi modalità'),
('ach_games_10', 'it', 'Principiante: 10 Partite', 'Gioca 10 partite in qualsiasi modalità'),
('ach_games_25', 'it', 'Dilettante: 25 Partite', 'Gioca 25 partite in qualsiasi modalità'),
('ach_games_50', 'it', 'Dilettante: 50 Partite', 'Gioca 50 partite in qualsiasi modalità'),
('ach_games_75', 'it', 'Dilettante: 75 Partite', 'Gioca 75 partite in qualsiasi modalità'),
('ach_games_100', 'it', 'Avanzato: 100 Partite', 'Gioca 100 partite in qualsiasi modalità'),
('ach_games_150', 'it', 'Avanzato: 150 Partite', 'Gioca 150 partite in qualsiasi modalità'),
('ach_games_200', 'it', 'Avanzato: 200 Partite', 'Gioca 200 partite in qualsiasi modalità'),
('ach_games_300', 'it', 'Esperto: 300 Partite', 'Gioca 300 partite in qualsiasi modalità'),
('ach_games_400', 'it', 'Esperto: 400 Partite', 'Gioca 400 partite in qualsiasi modalità'),
('ach_games_500', 'it', 'Esperto: 500 Partite', 'Gioca 500 partite in qualsiasi modalità'),
('ach_games_750', 'it', 'Maestro: 750 Partite', 'Gioca 750 partite in qualsiasi modalità'),
('ach_games_1000', 'it', 'Maestro: 1000 Partite', 'Gioca 1000 partite in qualsiasi modalità'),
('ach_games_1500', 'it', 'Maestro: 1500 Partite', 'Gioca 1500 partite in qualsiasi modalità'),
('ach_games_2000', 'it', 'Maestro: 2000 Partite', 'Gioca 2000 partite in qualsiasi modalità'),
('ach_games_2500', 'it', 'Leggenda: 2500 Partite', 'Gioca 2500 partite in qualsiasi modalità'),
('ach_games_3000', 'it', 'Leggenda: 3000 Partite', 'Gioca 3000 partite in qualsiasi modalità'),
('ach_games_4000', 'it', 'Leggenda: 4000 Partite', 'Gioca 4000 partite in qualsiasi modalità'),
('ach_games_5000', 'it', 'Leggenda: 5000 Partite', 'Gioca 5000 partite in qualsiasi modalità');

-- Portuguese (pt)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_games_1', 'pt', 'Iniciante: 1 Jogo', 'Jogue seu primeiro jogo em qualquer modo'),
('ach_games_5', 'pt', 'Iniciante: 5 Jogos', 'Jogue 5 partidas em qualquer modo'),
('ach_games_10', 'pt', 'Iniciante: 10 Jogos', 'Jogue 10 partidas em qualquer modo'),
('ach_games_25', 'pt', 'Amador: 25 Jogos', 'Jogue 25 partidas em qualquer modo'),
('ach_games_50', 'pt', 'Amador: 50 Jogos', 'Jogue 50 partidas em qualquer modo'),
('ach_games_75', 'pt', 'Amador: 75 Jogos', 'Jogue 75 partidas em qualquer modo'),
('ach_games_100', 'pt', 'Avançado: 100 Jogos', 'Jogue 100 partidas em qualquer modo'),
('ach_games_150', 'pt', 'Avançado: 150 Jogos', 'Jogue 150 partidas em qualquer modo'),
('ach_games_200', 'pt', 'Avançado: 200 Jogos', 'Jogue 200 partidas em qualquer modo'),
('ach_games_300', 'pt', 'Especialista: 300 Jogos', 'Jogue 300 partidas em qualquer modo'),
('ach_games_400', 'pt', 'Especialista: 400 Jogos', 'Jogue 400 partidas em qualquer modo'),
('ach_games_500', 'pt', 'Especialista: 500 Jogos', 'Jogue 500 partidas em qualquer modo'),
('ach_games_750', 'pt', 'Mestre: 750 Jogos', 'Jogue 750 partidas em qualquer modo'),
('ach_games_1000', 'pt', 'Mestre: 1000 Jogos', 'Jogue 1000 partidas em qualquer modo'),
('ach_games_1500', 'pt', 'Mestre: 1500 Jogos', 'Jogue 1500 partidas em qualquer modo'),
('ach_games_2000', 'pt', 'Mestre: 2000 Jogos', 'Jogue 2000 partidas em qualquer modo'),
('ach_games_2500', 'pt', 'Lenda: 2500 Jogos', 'Jogue 2500 partidas em qualquer modo'),
('ach_games_3000', 'pt', 'Lenda: 3000 Jogos', 'Jogue 3000 partidas em qualquer modo'),
('ach_games_4000', 'pt', 'Lenda: 4000 Jogos', 'Jogue 4000 partidas em qualquer modo'),
('ach_games_5000', 'pt', 'Lenda: 5000 Jogos', 'Jogue 5000 partidas em qualquer modo');

-- Danish (da)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_games_1', 'da', 'Begynder: 1 Spil', 'Spil dit første spil i enhver tilstand'),
('ach_games_5', 'da', 'Begynder: 5 Spil', 'Spil 5 spil i enhver tilstand'),
('ach_games_10', 'da', 'Begynder: 10 Spil', 'Spil 10 spil i enhver tilstand'),
('ach_games_25', 'da', 'Amatør: 25 Spil', 'Spil 25 spil i enhver tilstand'),
('ach_games_50', 'da', 'Amatør: 50 Spil', 'Spil 50 spil i enhver tilstand'),
('ach_games_75', 'da', 'Amatør: 75 Spil', 'Spil 75 spil i enhver tilstand'),
('ach_games_100', 'da', 'Øvet: 100 Spil', 'Spil 100 spil i enhver tilstand'),
('ach_games_150', 'da', 'Øvet: 150 Spil', 'Spil 150 spil i enhver tilstand'),
('ach_games_200', 'da', 'Øvet: 200 Spil', 'Spil 200 spil i enhver tilstand'),
('ach_games_300', 'da', 'Ekspert: 300 Spil', 'Spil 300 spil i enhver tilstand'),
('ach_games_400', 'da', 'Ekspert: 400 Spil', 'Spil 400 spil i enhver tilstand'),
('ach_games_500', 'da', 'Ekspert: 500 Spil', 'Spil 500 spil i enhver tilstand'),
('ach_games_750', 'da', 'Mester: 750 Spil', 'Spil 750 spil i enhver tilstand'),
('ach_games_1000', 'da', 'Mester: 1000 Spil', 'Spil 1000 spil i enhver tilstand'),
('ach_games_1500', 'da', 'Mester: 1500 Spil', 'Spil 1500 spil i enhver tilstand'),
('ach_games_2000', 'da', 'Mester: 2000 Spil', 'Spil 2000 spil i enhver tilstand'),
('ach_games_2500', 'da', 'Legende: 2500 Spil', 'Spil 2500 spil i enhver tilstand'),
('ach_games_3000', 'da', 'Legende: 3000 Spil', 'Spil 3000 spil i enhver tilstand'),
('ach_games_4000', 'da', 'Legende: 4000 Spil', 'Spil 4000 spil i enhver tilstand'),
('ach_games_5000', 'da', 'Legende: 5000 Spil', 'Spil 5000 spil i enhver tilstand');

-- Dutch (nl)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_games_1', 'nl', 'Beginner: 1 Spel', 'Speel je eerste spel in elke modus'),
('ach_games_5', 'nl', 'Beginner: 5 Spellen', 'Speel 5 spellen in elke modus'),
('ach_games_10', 'nl', 'Beginner: 10 Spellen', 'Speel 10 spellen in elke modus'),
('ach_games_25', 'nl', 'Amateur: 25 Spellen', 'Speel 25 spellen in elke modus'),
('ach_games_50', 'nl', 'Amateur: 50 Spellen', 'Speel 50 spellen in elke modus'),
('ach_games_75', 'nl', 'Amateur: 75 Spellen', 'Speel 75 spellen in elke modus'),
('ach_games_100', 'nl', 'Gevorderd: 100 Spellen', 'Speel 100 spellen in elke modus'),
('ach_games_150', 'nl', 'Gevorderd: 150 Spellen', 'Speel 150 spellen in elke modus'),
('ach_games_200', 'nl', 'Gevorderd: 200 Spellen', 'Speel 200 spellen in elke modus'),
('ach_games_300', 'nl', 'Expert: 300 Spellen', 'Speel 300 spellen in elke modus'),
('ach_games_400', 'nl', 'Expert: 400 Spellen', 'Speel 400 spellen in elke modus'),
('ach_games_500', 'nl', 'Expert: 500 Spellen', 'Speel 500 spellen in elke modus'),
('ach_games_750', 'nl', 'Meester: 750 Spellen', 'Speel 750 spellen in elke modus'),
('ach_games_1000', 'nl', 'Meester: 1000 Spellen', 'Speel 1000 spellen in elke modus'),
('ach_games_1500', 'nl', 'Meester: 1500 Spellen', 'Speel 1500 spellen in elke modus'),
('ach_games_2000', 'nl', 'Meester: 2000 Spellen', 'Speel 2000 spellen in elke modus'),
('ach_games_2500', 'nl', 'Legende: 2500 Spellen', 'Speel 2500 spellen in elke modus'),
('ach_games_3000', 'nl', 'Legende: 3000 Spellen', 'Speel 3000 spellen in elke modus'),
('ach_games_4000', 'nl', 'Legende: 4000 Spellen', 'Speel 4000 spellen in elke modus'),
('ach_games_5000', 'nl', 'Legende: 5000 Spellen', 'Speel 5000 spellen in elke modus');

-- Swedish (sv)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_games_1', 'sv', 'Nybörjare: 1 Spel', 'Spela ditt första spel i valfritt läge'),
('ach_games_5', 'sv', 'Nybörjare: 5 Spel', 'Spela 5 spel i valfritt läge'),
('ach_games_10', 'sv', 'Nybörjare: 10 Spel', 'Spela 10 spel i valfritt läge'),
('ach_games_25', 'sv', 'Amatör: 25 Spel', 'Spela 25 spel i valfritt läge'),
('ach_games_50', 'sv', 'Amatör: 50 Spel', 'Spela 50 spel i valfritt läge'),
('ach_games_75', 'sv', 'Amatör: 75 Spel', 'Spela 75 spel i valfritt läge'),
('ach_games_100', 'sv', 'Avancerad: 100 Spel', 'Spela 100 spel i valfritt läge'),
('ach_games_150', 'sv', 'Avancerad: 150 Spel', 'Spela 150 spel i valfritt läge'),
('ach_games_200', 'sv', 'Avancerad: 200 Spel', 'Spela 200 spel i valfritt läge'),
('ach_games_300', 'sv', 'Expert: 300 Spel', 'Spela 300 spel i valfritt läge'),
('ach_games_400', 'sv', 'Expert: 400 Spel', 'Spela 400 spel i valfritt läge'),
('ach_games_500', 'sv', 'Expert: 500 Spel', 'Spela 500 spel i valfritt läge'),
('ach_games_750', 'sv', 'Mästare: 750 Spel', 'Spela 750 spel i valfritt läge'),
('ach_games_1000', 'sv', 'Mästare: 1000 Spel', 'Spela 1000 spel i valfritt läge'),
('ach_games_1500', 'sv', 'Mästare: 1500 Spel', 'Spela 1500 spel i valfritt läge'),
('ach_games_2000', 'sv', 'Mästare: 2000 Spel', 'Spela 2000 spel i valfritt läge'),
('ach_games_2500', 'sv', 'Legend: 2500 Spel', 'Spela 2500 spel i valfritt läge'),
('ach_games_3000', 'sv', 'Legend: 3000 Spel', 'Spela 3000 spel i valfritt läge'),
('ach_games_4000', 'sv', 'Legend: 4000 Spel', 'Spela 4000 spel i valfritt läge'),
('ach_games_5000', 'sv', 'Legend: 5000 Spel', 'Spela 5000 spel i valfritt läge');

-- Finnish (fi)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_games_1', 'fi', 'Aloittelija: 1 Peli', 'Pelaa ensimmäinen pelisi missä tahansa tilassa'),
('ach_games_5', 'fi', 'Aloittelija: 5 Peliä', 'Pelaa 5 peliä missä tahansa tilassa'),
('ach_games_10', 'fi', 'Aloittelija: 10 Peliä', 'Pelaa 10 peliä missä tahansa tilassa'),
('ach_games_25', 'fi', 'Harrastelija: 25 Peliä', 'Pelaa 25 peliä missä tahansa tilassa'),
('ach_games_50', 'fi', 'Harrastelija: 50 Peliä', 'Pelaa 50 peliä missä tahansa tilassa'),
('ach_games_75', 'fi', 'Harrastelija: 75 Peliä', 'Pelaa 75 peliä missä tahansa tilassa'),
('ach_games_100', 'fi', 'Edistynyt: 100 Peliä', 'Pelaa 100 peliä missä tahansa tilassa'),
('ach_games_150', 'fi', 'Edistynyt: 150 Peliä', 'Pelaa 150 peliä missä tahansa tilassa'),
('ach_games_200', 'fi', 'Edistynyt: 200 Peliä', 'Pelaa 200 peliä missä tahansa tilassa'),
('ach_games_300', 'fi', 'Asiantuntija: 300 Peliä', 'Pelaa 300 peliä missä tahansa tilassa'),
('ach_games_400', 'fi', 'Asiantuntija: 400 Peliä', 'Pelaa 400 peliä missä tahansa tilassa'),
('ach_games_500', 'fi', 'Asiantuntija: 500 Peliä', 'Pelaa 500 peliä missä tahansa tilassa'),
('ach_games_750', 'fi', 'Mestari: 750 Peliä', 'Pelaa 750 peliä missä tahansa tilassa'),
('ach_games_1000', 'fi', 'Mestari: 1000 Peliä', 'Pelaa 1000 peliä missä tahansa tilassa'),
('ach_games_1500', 'fi', 'Mestari: 1500 Peliä', 'Pelaa 1500 peliä missä tahansa tilassa'),
('ach_games_2000', 'fi', 'Mestari: 2000 Peliä', 'Pelaa 2000 peliä missä tahansa tilassa'),
('ach_games_2500', 'fi', 'Legenda: 2500 Peliä', 'Pelaa 2500 peliä missä tahansa tilassa'),
('ach_games_3000', 'fi', 'Legenda: 3000 Peliä', 'Pelaa 3000 peliä missä tahansa tilassa'),
('ach_games_4000', 'fi', 'Legenda: 4000 Peliä', 'Pelaa 4000 peliä missä tahansa tilassa'),
('ach_games_5000', 'fi', 'Legenda: 5000 Peliä', 'Pelaa 5000 peliä missä tahansa tilassa');

-- =============================================
-- Perfect Games Achievements (Perfekte-Spiele-Achievements)
-- =============================================

-- German (de)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_perfect_1', 'de', 'Glückstreffer: 1 perfektes Spiel', 'Erreiche in einem Spiel die maximale Punktzahl'),
('ach_perfect_2', 'de', 'Glückstreffer: 2 perfekte Spiele', 'Erreiche in 2 Spielen die maximale Punktzahl'),
('ach_perfect_3', 'de', 'Glückstreffer: 3 perfekte Spiele', 'Erreiche in 3 Spielen die maximale Punktzahl'),
('ach_perfect_5', 'de', 'Präzision: 5 perfekte Spiele', 'Erreiche in 5 Spielen die maximale Punktzahl'),
('ach_perfect_7', 'de', 'Präzision: 7 perfekte Spiele', 'Erreiche in 7 Spielen die maximale Punktzahl'),
('ach_perfect_10', 'de', 'Präzision: 10 perfekte Spiele', 'Erreiche in 10 Spielen die maximale Punktzahl'),
('ach_perfect_15', 'de', 'Expertise: 15 perfekte Spiele', 'Erreiche in 15 Spielen die maximale Punktzahl'),
('ach_perfect_20', 'de', 'Expertise: 20 perfekte Spiele', 'Erreiche in 20 Spielen die maximale Punktzahl'),
('ach_perfect_25', 'de', 'Expertise: 25 perfekte Spiele', 'Erreiche in 25 Spielen die maximale Punktzahl'),
('ach_perfect_30', 'de', 'Meisterschaft: 30 perfekte Spiele', 'Erreiche in 30 Spielen die maximale Punktzahl'),
('ach_perfect_40', 'de', 'Meisterschaft: 40 perfekte Spiele', 'Erreiche in 40 Spielen die maximale Punktzahl'),
('ach_perfect_50', 'de', 'Meisterschaft: 50 perfekte Spiele', 'Erreiche in 50 Spielen die maximale Punktzahl'),
('ach_perfect_75', 'de', 'Perfektion: 75 perfekte Spiele', 'Erreiche in 75 Spielen die maximale Punktzahl'),
('ach_perfect_100', 'de', 'Perfektion: 100 perfekte Spiele', 'Erreiche in 100 Spielen die maximale Punktzahl'),
('ach_perfect_150', 'de', 'Perfektion: 150 perfekte Spiele', 'Erreiche in 150 Spielen die maximale Punktzahl'),
('ach_perfect_200', 'de', 'Legende: 200 perfekte Spiele', 'Erreiche in 200 Spielen die maximale Punktzahl'),
('ach_perfect_300', 'de', 'Legende: 300 perfekte Spiele', 'Erreiche in 300 Spielen die maximale Punktzahl'),
('ach_perfect_400', 'de', 'Legende: 400 perfekte Spiele', 'Erreiche in 400 Spielen die maximale Punktzahl'),
('ach_perfect_500', 'de', 'Legende: 500 perfekte Spiele', 'Erreiche in 500 Spielen die maximale Punktzahl');

-- English (en)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_perfect_1', 'en', 'Lucky Shot: 1 Perfect Game', 'Achieve maximum score in 1 game'),
('ach_perfect_2', 'en', 'Lucky Shot: 2 Perfect Games', 'Achieve maximum score in 2 games'),
('ach_perfect_3', 'en', 'Lucky Shot: 3 Perfect Games', 'Achieve maximum score in 3 games'),
('ach_perfect_5', 'en', 'Precision: 5 Perfect Games', 'Achieve maximum score in 5 games'),
('ach_perfect_7', 'en', 'Precision: 7 Perfect Games', 'Achieve maximum score in 7 games'),
('ach_perfect_10', 'en', 'Precision: 10 Perfect Games', 'Achieve maximum score in 10 games'),
('ach_perfect_15', 'en', 'Expertise: 15 Perfect Games', 'Achieve maximum score in 15 games'),
('ach_perfect_20', 'en', 'Expertise: 20 Perfect Games', 'Achieve maximum score in 20 games'),
('ach_perfect_25', 'en', 'Expertise: 25 Perfect Games', 'Achieve maximum score in 25 games'),
('ach_perfect_30', 'en', 'Mastery: 30 Perfect Games', 'Achieve maximum score in 30 games'),
('ach_perfect_40', 'en', 'Mastery: 40 Perfect Games', 'Achieve maximum score in 40 games'),
('ach_perfect_50', 'en', 'Mastery: 50 Perfect Games', 'Achieve maximum score in 50 games'),
('ach_perfect_75', 'en', 'Perfection: 75 Perfect Games', 'Achieve maximum score in 75 games'),
('ach_perfect_100', 'en', 'Perfection: 100 Perfect Games', 'Achieve maximum score in 100 games'),
('ach_perfect_150', 'en', 'Perfection: 150 Perfect Games', 'Achieve maximum score in 150 games'),
('ach_perfect_200', 'en', 'Legend: 200 Perfect Games', 'Achieve maximum score in 200 games'),
('ach_perfect_300', 'en', 'Legend: 300 Perfect Games', 'Achieve maximum score in 300 games'),
('ach_perfect_400', 'en', 'Legend: 400 Perfect Games', 'Achieve maximum score in 400 games'),
('ach_perfect_500', 'en', 'Legend: 500 Perfect Games', 'Achieve maximum score in 500 games');

-- French (fr)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_perfect_1', 'fr', 'Coup de Chance: 1 Partie Parfaite', 'Obtenez le score maximum dans 1 partie'),
('ach_perfect_2', 'fr', 'Coup de Chance: 2 Parties Parfaites', 'Obtenez le score maximum dans 2 parties'),
('ach_perfect_3', 'fr', 'Coup de Chance: 3 Parties Parfaites', 'Obtenez le score maximum dans 3 parties'),
('ach_perfect_5', 'fr', 'Précision: 5 Parties Parfaites', 'Obtenez le score maximum dans 5 parties'),
('ach_perfect_7', 'fr', 'Précision: 7 Parties Parfaites', 'Obtenez le score maximum dans 7 parties'),
('ach_perfect_10', 'fr', 'Précision: 10 Parties Parfaites', 'Obtenez le score maximum dans 10 parties'),
('ach_perfect_15', 'fr', 'Expertise: 15 Parties Parfaites', 'Obtenez le score maximum dans 15 parties'),
('ach_perfect_20', 'fr', 'Expertise: 20 Parties Parfaites', 'Obtenez le score maximum dans 20 parties'),
('ach_perfect_25', 'fr', 'Expertise: 25 Parties Parfaites', 'Obtenez le score maximum dans 25 parties'),
('ach_perfect_30', 'fr', 'Maîtrise: 30 Parties Parfaites', 'Obtenez le score maximum dans 30 parties'),
('ach_perfect_40', 'fr', 'Maîtrise: 40 Parties Parfaites', 'Obtenez le score maximum dans 40 parties'),
('ach_perfect_50', 'fr', 'Maîtrise: 50 Parties Parfaites', 'Obtenez le score maximum dans 50 parties'),
('ach_perfect_75', 'fr', 'Perfection: 75 Parties Parfaites', 'Obtenez le score maximum dans 75 parties'),
('ach_perfect_100', 'fr', 'Perfection: 100 Parties Parfaites', 'Obtenez le score maximum dans 100 parties'),
('ach_perfect_150', 'fr', 'Perfection: 150 Parties Parfaites', 'Obtenez le score maximum dans 150 parties'),
('ach_perfect_200', 'fr', 'Légende: 200 Parties Parfaites', 'Obtenez le score maximum dans 200 parties'),
('ach_perfect_300', 'fr', 'Légende: 300 Parties Parfaites', 'Obtenez le score maximum dans 300 parties'),
('ach_perfect_400', 'fr', 'Légende: 400 Parties Parfaites', 'Obtenez le score maximum dans 400 parties'),
('ach_perfect_500', 'fr', 'Légende: 500 Parties Parfaites', 'Obtenez le score maximum dans 500 parties');

-- Spanish (es)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_perfect_1', 'es', 'Golpe de Suerte: 1 Juego Perfecto', 'Consigue la puntuación máxima en 1 juego'),
('ach_perfect_2', 'es', 'Golpe de Suerte: 2 Juegos Perfectos', 'Consigue la puntuación máxima en 2 juegos'),
('ach_perfect_3', 'es', 'Golpe de Suerte: 3 Juegos Perfectos', 'Consigue la puntuación máxima en 3 juegos'),
('ach_perfect_5', 'es', 'Precisión: 5 Juegos Perfectos', 'Consigue la puntuación máxima en 5 juegos'),
('ach_perfect_7', 'es', 'Precisión: 7 Juegos Perfectos', 'Consigue la puntuación máxima en 7 juegos'),
('ach_perfect_10', 'es', 'Precisión: 10 Juegos Perfectos', 'Consigue la puntuación máxima en 10 juegos'),
('ach_perfect_15', 'es', 'Pericia: 15 Juegos Perfectos', 'Consigue la puntuación máxima en 15 juegos'),
('ach_perfect_20', 'es', 'Pericia: 20 Juegos Perfectos', 'Consigue la puntuación máxima en 20 juegos'),
('ach_perfect_25', 'es', 'Pericia: 25 Juegos Perfectos', 'Consigue la puntuación máxima en 25 juegos'),
('ach_perfect_30', 'es', 'Maestría: 30 Juegos Perfectos', 'Consigue la puntuación máxima en 30 juegos'),
('ach_perfect_40', 'es', 'Maestría: 40 Juegos Perfectos', 'Consigue la puntuación máxima en 40 juegos'),
('ach_perfect_50', 'es', 'Maestría: 50 Juegos Perfectos', 'Consigue la puntuación máxima en 50 juegos'),
('ach_perfect_75', 'es', 'Perfección: 75 Juegos Perfectos', 'Consigue la puntuación máxima en 75 juegos'),
('ach_perfect_100', 'es', 'Perfección: 100 Juegos Perfectos', 'Consigue la puntuación máxima en 100 juegos'),
('ach_perfect_150', 'es', 'Perfección: 150 Juegos Perfectos', 'Consigue la puntuación máxima en 150 juegos'),
('ach_perfect_200', 'es', 'Leyenda: 200 Juegos Perfectos', 'Consigue la puntuación máxima en 200 juegos'),
('ach_perfect_300', 'es', 'Leyenda: 300 Juegos Perfectos', 'Consigue la puntuación máxima en 300 juegos'),
('ach_perfect_400', 'es', 'Leyenda: 400 Juegos Perfectos', 'Consigue la puntuación máxima en 400 juegos'),
('ach_perfect_500', 'es', 'Leyenda: 500 Juegos Perfectos', 'Consigue la puntuación máxima en 500 juegos');

-- Italian (it)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_perfect_1', 'it', 'Colpo di Fortuna: 1 Partita Perfetta', 'Ottieni il punteggio massimo in 1 partita'),
('ach_perfect_2', 'it', 'Colpo di Fortuna: 2 Partite Perfette', 'Ottieni il punteggio massimo in 2 partite'),
('ach_perfect_3', 'it', 'Colpo di Fortuna: 3 Partite Perfette', 'Ottieni il punteggio massimo in 3 partite'),
('ach_perfect_5', 'it', 'Precisione: 5 Partite Perfette', 'Ottieni il punteggio massimo in 5 partite'),
('ach_perfect_7', 'it', 'Precisione: 7 Partite Perfette', 'Ottieni il punteggio massimo in 7 partite'),
('ach_perfect_10', 'it', 'Precisione: 10 Partite Perfette', 'Ottieni il punteggio massimo in 10 partite'),
('ach_perfect_15', 'it', 'Competenza: 15 Partite Perfette', 'Ottieni il punteggio massimo in 15 partite'),
('ach_perfect_20', 'it', 'Competenza: 20 Partite Perfette', 'Ottieni il punteggio massimo in 20 partite'),
('ach_perfect_25', 'it', 'Competenza: 25 Partite Perfette', 'Ottieni il punteggio massimo in 25 partite'),
('ach_perfect_30', 'it', 'Maestria: 30 Partite Perfette', 'Ottieni il punteggio massimo in 30 partite'),
('ach_perfect_40', 'it', 'Maestria: 40 Partite Perfette', 'Ottieni il punteggio massimo in 40 partite'),
('ach_perfect_50', 'it', 'Maestria: 50 Partite Perfette', 'Ottieni il punteggio massimo in 50 partite'),
('ach_perfect_75', 'it', 'Perfezione: 75 Partite Perfette', 'Ottieni il punteggio massimo in 75 partite'),
('ach_perfect_100', 'it', 'Perfezione: 100 Partite Perfette', 'Ottieni il punteggio massimo in 100 partite'),
('ach_perfect_150', 'it', 'Perfezione: 150 Partite Perfette', 'Ottieni il punteggio massimo in 150 partite'),
('ach_perfect_200', 'it', 'Leggenda: 200 Partite Perfette', 'Ottieni il punteggio massimo in 200 partite'),
('ach_perfect_300', 'it', 'Leggenda: 300 Partite Perfette', 'Ottieni il punteggio massimo in 300 partite'),
('ach_perfect_400', 'it', 'Leggenda: 400 Partite Perfette', 'Ottieni il punteggio massimo in 400 partite'),
('ach_perfect_500', 'it', 'Leggenda: 500 Partite Perfette', 'Ottieni il punteggio massimo in 500 partite');

-- Portuguese (pt)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_perfect_1', 'pt', 'Golpe de Sorte: 1 Jogo Perfeito', 'Alcance a pontuação máxima em 1 jogo'),
('ach_perfect_2', 'pt', 'Golpe de Sorte: 2 Jogos Perfeitos', 'Alcance a pontuação máxima em 2 jogos'),
('ach_perfect_3', 'pt', 'Golpe de Sorte: 3 Jogos Perfeitos', 'Alcance a pontuação máxima em 3 jogos'),
('ach_perfect_5', 'pt', 'Precisão: 5 Jogos Perfeitos', 'Alcance a pontuação máxima em 5 jogos'),
('ach_perfect_7', 'pt', 'Precisão: 7 Jogos Perfeitos', 'Alcance a pontuação máxima em 7 jogos'),
('ach_perfect_10', 'pt', 'Precisão: 10 Jogos Perfeitos', 'Alcance a pontuação máxima em 10 jogos'),
('ach_perfect_15', 'pt', 'Experiência: 15 Jogos Perfeitos', 'Alcance a pontuação máxima em 15 jogos'),
('ach_perfect_20', 'pt', 'Experiência: 20 Jogos Perfeitos', 'Alcance a pontuação máxima em 20 jogos'),
('ach_perfect_25', 'pt', 'Experiência: 25 Jogos Perfeitos', 'Alcance a pontuação máxima em 25 jogos'),
('ach_perfect_30', 'pt', 'Maestria: 30 Jogos Perfeitos', 'Alcance a pontuação máxima em 30 jogos'),
('ach_perfect_40', 'pt', 'Maestria: 40 Jogos Perfeitos', 'Alcance a pontuação máxima em 40 jogos'),
('ach_perfect_50', 'pt', 'Maestria: 50 Jogos Perfeitos', 'Alcance a pontuação máxima em 50 jogos'),
('ach_perfect_75', 'pt', 'Perfeição: 75 Jogos Perfeitos', 'Alcance a pontuação máxima em 75 jogos'),
('ach_perfect_100', 'pt', 'Perfeição: 100 Jogos Perfeitos', 'Alcance a pontuação máxima em 100 jogos'),
('ach_perfect_150', 'pt', 'Perfeição: 150 Jogos Perfeitos', 'Alcance a pontuação máxima em 150 jogos'),
('ach_perfect_200', 'pt', 'Lenda: 200 Jogos Perfeitos', 'Alcance a pontuação máxima em 200 jogos'),
('ach_perfect_300', 'pt', 'Lenda: 300 Jogos Perfeitos', 'Alcance a pontuação máxima em 300 jogos'),
('ach_perfect_400', 'pt', 'Lenda: 400 Jogos Perfeitos', 'Alcance a pontuação máxima em 400 jogos'),
('ach_perfect_500', 'pt', 'Lenda: 500 Jogos Perfeitos', 'Alcance a pontuação máxima em 500 jogos');

-- Danish (da)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_perfect_1', 'da', 'Heldig Skud: 1 Perfekt Spil', 'Opnå maksimum score i 1 spil'),
('ach_perfect_2', 'da', 'Heldig Skud: 2 Perfekte Spil', 'Opnå maksimum score i 2 spil'),
('ach_perfect_3', 'da', 'Heldig Skud: 3 Perfekte Spil', 'Opnå maksimum score i 3 spil'),
('ach_perfect_5', 'da', 'Præcision: 5 Perfekte Spil', 'Opnå maksimum score i 5 spil'),
('ach_perfect_7', 'da', 'Præcision: 7 Perfekte Spil', 'Opnå maksimum score i 7 spil'),
('ach_perfect_10', 'da', 'Præcision: 10 Perfekte Spil', 'Opnå maksimum score i 10 spil'),
('ach_perfect_15', 'da', 'Ekspertise: 15 Perfekte Spil', 'Opnå maksimum score i 15 spil'),
('ach_perfect_20', 'da', 'Ekspertise: 20 Perfekte Spil', 'Opnå maksimum score i 20 spil'),
('ach_perfect_25', 'da', 'Ekspertise: 25 Perfekte Spil', 'Opnå maksimum score i 25 spil'),
('ach_perfect_30', 'da', 'Mesterskab: 30 Perfekte Spil', 'Opnå maksimum score i 30 spil'),
('ach_perfect_40', 'da', 'Mesterskab: 40 Perfekte Spil', 'Opnå maksimum score i 40 spil'),
('ach_perfect_50', 'da', 'Mesterskab: 50 Perfekte Spil', 'Opnå maksimum score i 50 spil'),
('ach_perfect_75', 'da', 'Perfektion: 75 Perfekte Spil', 'Opnå maksimum score i 75 spil'),
('ach_perfect_100', 'da', 'Perfektion: 100 Perfekte Spil', 'Opnå maksimum score i 100 spil'),
('ach_perfect_150', 'da', 'Perfektion: 150 Perfekte Spil', 'Opnå maksimum score i 150 spil'),
('ach_perfect_200', 'da', 'Legende: 200 Perfekte Spil', 'Opnå maksimum score i 200 spil'),
('ach_perfect_300', 'da', 'Legende: 300 Perfekte Spil', 'Opnå maksimum score i 300 spil'),
('ach_perfect_400', 'da', 'Legende: 400 Perfekte Spil', 'Opnå maksimum score i 400 spil'),
('ach_perfect_500', 'da', 'Legende: 500 Perfekte Spil', 'Opnå maksimum score i 500 spil');

-- Dutch (nl)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_perfect_1', 'nl', 'Geluksschot: 1 Perfect Spel', 'Behaal de maximale score in 1 spel'),
('ach_perfect_2', 'nl', 'Geluksschot: 2 Perfecte Spellen', 'Behaal de maximale score in 2 spellen'),
('ach_perfect_3', 'nl', 'Geluksschot: 3 Perfecte Spellen', 'Behaal de maximale score in 3 spellen'),
('ach_perfect_5', 'nl', 'Precisie: 5 Perfecte Spellen', 'Behaal de maximale score in 5 spellen'),
('ach_perfect_7', 'nl', 'Precisie: 7 Perfecte Spellen', 'Behaal de maximale score in 7 spellen'),
('ach_perfect_10', 'nl', 'Precisie: 10 Perfecte Spellen', 'Behaal de maximale score in 10 spellen'),
('ach_perfect_15', 'nl', 'Expertise: 15 Perfecte Spellen', 'Behaal de maximale score in 15 spellen'),
('ach_perfect_20', 'nl', 'Expertise: 20 Perfecte Spellen', 'Behaal de maximale score in 20 spellen'),
('ach_perfect_25', 'nl', 'Expertise: 25 Perfecte Spellen', 'Behaal de maximale score in 25 spellen'),
('ach_perfect_30', 'nl', 'Meesterschap: 30 Perfecte Spellen', 'Behaal de maximale score in 30 spellen'),
('ach_perfect_40', 'nl', 'Meesterschap: 40 Perfecte Spellen', 'Behaal de maximale score in 40 spellen'),
('ach_perfect_50', 'nl', 'Meesterschap: 50 Perfecte Spellen', 'Behaal de maximale score in 50 spellen'),
('ach_perfect_75', 'nl', 'Perfectie: 75 Perfecte Spellen', 'Behaal de maximale score in 75 spellen'),
('ach_perfect_100', 'nl', 'Perfectie: 100 Perfecte Spellen', 'Behaal de maximale score in 100 spellen'),
('ach_perfect_150', 'nl', 'Perfectie: 150 Perfecte Spellen', 'Behaal de maximale score in 150 spellen'),
('ach_perfect_200', 'nl', 'Legende: 200 Perfecte Spellen', 'Behaal de maximale score in 200 spellen'),
('ach_perfect_300', 'nl', 'Legende: 300 Perfecte Spellen', 'Behaal de maximale score in 300 spellen'),
('ach_perfect_400', 'nl', 'Legende: 400 Perfecte Spellen', 'Behaal de maximale score in 400 spellen'),
('ach_perfect_500', 'nl', 'Legende: 500 Perfecte Spellen', 'Behaal de maximale score in 500 spellen');

-- Swedish (sv)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_perfect_1', 'sv', 'Lyckoskott: 1 Perfekt Spel', 'Uppnå maximal poäng i 1 spel'),
('ach_perfect_2', 'sv', 'Lyckoskott: 2 Perfekta Spel', 'Uppnå maximal poäng i 2 spel'),
('ach_perfect_3', 'sv', 'Lyckoskott: 3 Perfekta Spel', 'Uppnå maximal poäng i 3 spel'),
('ach_perfect_5', 'sv', 'Precision: 5 Perfekta Spel', 'Uppnå maximal poäng i 5 spel'),
('ach_perfect_7', 'sv', 'Precision: 7 Perfekta Spel', 'Uppnå maximal poäng i 7 spel'),
('ach_perfect_10', 'sv', 'Precision: 10 Perfekta Spel', 'Uppnå maximal poäng i 10 spel'),
('ach_perfect_15', 'sv', 'Expertis: 15 Perfekta Spel', 'Uppnå maximal poäng i 15 spel'),
('ach_perfect_20', 'sv', 'Expertis: 20 Perfekta Spel', 'Uppnå maximal poäng i 20 spel'),
('ach_perfect_25', 'sv', 'Expertis: 25 Perfekta Spel', 'Uppnå maximal poäng i 25 spel'),
('ach_perfect_30', 'sv', 'Mästerskap: 30 Perfekta Spel', 'Uppnå maximal poäng i 30 spel'),
('ach_perfect_40', 'sv', 'Mästerskap: 40 Perfekta Spel', 'Uppnå maximal poäng i 40 spel'),
('ach_perfect_50', 'sv', 'Mästerskap: 50 Perfekta Spel', 'Uppnå maximal poäng i 50 spel'),
('ach_perfect_75', 'sv', 'Perfektion: 75 Perfekta Spel', 'Uppnå maximal poäng i 75 spel'),
('ach_perfect_100', 'sv', 'Perfektion: 100 Perfekta Spel', 'Uppnå maximal poäng i 100 spel'),
('ach_perfect_150', 'sv', 'Perfektion: 150 Perfekta Spel', 'Uppnå maximal poäng i 150 spel'),
('ach_perfect_200', 'sv', 'Legend: 200 Perfekta Spel', 'Uppnå maximal poäng i 200 spel'),
('ach_perfect_300', 'sv', 'Legend: 300 Perfekta Spel', 'Uppnå maximal poäng i 300 spel'),
('ach_perfect_400', 'sv', 'Legend: 400 Perfekta Spel', 'Uppnå maximal poäng i 400 spel'),
('ach_perfect_500', 'sv', 'Legend: 500 Perfekta Spel', 'Uppnå maximal poäng i 500 spel');

-- Finnish (fi)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_perfect_1', 'fi', 'Onnekas Laukaus: 1 Täydellinen Peli', 'Saavuta maksimipisteet 1 pelissä'),
('ach_perfect_2', 'fi', 'Onnekas Laukaus: 2 Täydellistä Peliä', 'Saavuta maksimipisteet 2 pelissä'),
('ach_perfect_3', 'fi', 'Onnekas Laukaus: 3 Täydellistä Peliä', 'Saavuta maksimipisteet 3 pelissä'),
('ach_perfect_5', 'fi', 'Tarkkuus: 5 Täydellistä Peliä', 'Saavuta maksimipisteet 5 pelissä'),
('ach_perfect_7', 'fi', 'Tarkkuus: 7 Täydellistä Peliä', 'Saavuta maksimipisteet 7 pelissä'),
('ach_perfect_10', 'fi', 'Tarkkuus: 10 Täydellistä Peliä', 'Saavuta maksimipisteet 10 pelissä'),
('ach_perfect_15', 'fi', 'Asiantuntemus: 15 Täydellistä Peliä', 'Saavuta maksimipisteet 15 pelissä'),
('ach_perfect_20', 'fi', 'Asiantuntemus: 20 Täydellistä Peliä', 'Saavuta maksimipisteet 20 pelissä'),
('ach_perfect_25', 'fi', 'Asiantuntemus: 25 Täydellistä Peliä', 'Saavuta maksimipisteet 25 pelissä'),
('ach_perfect_30', 'fi', 'Mestaruus: 30 Täydellistä Peliä', 'Saavuta maksimipisteet 30 pelissä'),
('ach_perfect_40', 'fi', 'Mestaruus: 40 Täydellistä Peliä', 'Saavuta maksimipisteet 40 pelissä'),
('ach_perfect_50', 'fi', 'Mestaruus: 50 Täydellistä Peliä', 'Saavuta maksimipisteet 50 pelissä'),
('ach_perfect_75', 'fi', 'Täydellisyys: 75 Täydellistä Peliä', 'Saavuta maksimipisteet 75 pelissä'),
('ach_perfect_100', 'fi', 'Täydellisyys: 100 Täydellistä Peliä', 'Saavuta maksimipisteet 100 pelissä'),
('ach_perfect_150', 'fi', 'Täydellisyys: 150 Täydellistä Peliä', 'Saavuta maksimipisteet 150 pelissä'),
('ach_perfect_200', 'fi', 'Legenda: 200 Täydellistä Peliä', 'Saavuta maksimipisteet 200 pelissä'),
('ach_perfect_300', 'fi', 'Legenda: 300 Täydellistä Peliä', 'Saavuta maksimipisteet 300 pelissä'),
('ach_perfect_400', 'fi', 'Legenda: 400 Täydellistä Peliä', 'Saavuta maksimipisteet 400 pelissä'),
('ach_perfect_500', 'fi', 'Legenda: 500 Täydellistä Peliä', 'Saavuta maksimipisteet 500 pelissä');

-- =============================================
-- Total Score Achievements (Punktestand-Achievements)
-- =============================================

-- German (de)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_score_1000', 'de', 'Sammler: 1.000 Punkte', 'Sammle insgesamt 1.000 Punkte (entspricht 1 perfektem Spiel)'),
('ach_score_2500', 'de', 'Sammler: 2.500 Punkte', 'Sammle insgesamt 2.500 Punkte (entspricht 2-3 perfekten Spielen)'),
('ach_score_5000', 'de', 'Sammler: 5.000 Punkte', 'Sammle insgesamt 5.000 Punkte (entspricht 5 perfekten Spielen)'),
('ach_score_10000', 'de', 'Punktejäger: 10.000 Punkte', 'Sammle insgesamt 10.000 Punkte (entspricht 10 perfekten Spielen)'),
('ach_score_25000', 'de', 'Punktejäger: 25.000 Punkte', 'Sammle insgesamt 25.000 Punkte (entspricht 25 perfekten Spielen)'),
('ach_score_50000', 'de', 'Punktejäger: 50.000 Punkte', 'Sammle insgesamt 50.000 Punkte (entspricht 50 perfekten Spielen)'),
('ach_score_75000', 'de', 'Punktemagnet: 75.000 Punkte', 'Sammle insgesamt 75.000 Punkte (entspricht 75 perfekten Spielen)'),
('ach_score_100000', 'de', 'Punktemagnet: 100.000 Punkte', 'Sammle insgesamt 100.000 Punkte (entspricht 100 perfekten Spielen)'),
('ach_score_150000', 'de', 'Punktemagnet: 150.000 Punkte', 'Sammle insgesamt 150.000 Punkte (entspricht 150 perfekten Spielen)'),
('ach_score_200000', 'de', 'Punktemeister: 200.000 Punkte', 'Sammle insgesamt 200.000 Punkte (entspricht 200 perfekten Spielen)'),
('ach_score_300000', 'de', 'Punktemeister: 300.000 Punkte', 'Sammle insgesamt 300.000 Punkte (entspricht 300 perfekten Spielen)'),
('ach_score_500000', 'de', 'Punktemeister: 500.000 Punkte', 'Sammle insgesamt 500.000 Punkte (entspricht 500 perfekten Spielen)'),
('ach_score_750000', 'de', 'Elite: 750.000 Punkte', 'Sammle insgesamt 750.000 Punkte (entspricht 750 perfekten Spielen)'),
('ach_score_1000000', 'de', 'Elite: 1.000.000 Punkte', 'Sammle insgesamt 1.000.000 Punkte (entspricht 1000 perfekten Spielen)'),
('ach_score_1500000', 'de', 'Elite: 1.500.000 Punkte', 'Sammle insgesamt 1.500.000 Punkte (entspricht 1500 perfekten Spielen)'),
('ach_score_2000000', 'de', 'Legende: 2.000.000 Punkte', 'Sammle insgesamt 2.000.000 Punkte (entspricht 2000 perfekten Spielen)'),
('ach_score_3000000', 'de', 'Legende: 3.000.000 Punkte', 'Sammle insgesamt 3.000.000 Punkte (entspricht 3000 perfekten Spielen)'),
('ach_score_5000000', 'de', 'Legende: 5.000.000 Punkte', 'Sammle insgesamt 5.000.000 Punkte (entspricht 5000 perfekten Spielen)');

-- English (en)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_score_1000', 'en', 'Collector: 1,000 Points', 'Accumulate 1,000 points (equivalent to 1 perfect game)'),
('ach_score_2500', 'en', 'Collector: 2,500 Points', 'Accumulate 2,500 points (equivalent to 2-3 perfect games)'),
('ach_score_5000', 'en', 'Collector: 5,000 Points', 'Accumulate 5,000 points (equivalent to 5 perfect games)'),
('ach_score_10000', 'en', 'Point Hunter: 10,000 Points', 'Accumulate 10,000 points (equivalent to 10 perfect games)'),
('ach_score_25000', 'en', 'Point Hunter: 25,000 Points', 'Accumulate 25,000 points (equivalent to 25 perfect games)'),
('ach_score_50000', 'en', 'Point Hunter: 50,000 Points', 'Accumulate 50,000 points (equivalent to 50 perfect games)'),
('ach_score_75000', 'en', 'Point Magnet: 75,000 Points', 'Accumulate 75,000 points (equivalent to 75 perfect games)'),
('ach_score_100000', 'en', 'Point Magnet: 100,000 Points', 'Accumulate 100,000 points (equivalent to 100 perfect games)'),
('ach_score_150000', 'en', 'Point Magnet: 150,000 Points', 'Accumulate 150,000 points (equivalent to 150 perfect games)'),
('ach_score_200000', 'en', 'Point Master: 200,000 Points', 'Accumulate 200,000 points (equivalent to 200 perfect games)'),
('ach_score_300000', 'en', 'Point Master: 300,000 Points', 'Accumulate 300,000 points (equivalent to 300 perfect games)'),
('ach_score_500000', 'en', 'Point Master: 500,000 Points', 'Accumulate 500,000 points (equivalent to 500 perfect games)'),
('ach_score_750000', 'en', 'Elite: 750,000 Points', 'Accumulate 750,000 points (equivalent to 750 perfect games)'),
('ach_score_1000000', 'en', 'Elite: 1,000,000 Points', 'Accumulate 1,000,000 points (equivalent to 1000 perfect games)'),
('ach_score_1500000', 'en', 'Elite: 1,500,000 Points', 'Accumulate 1,500,000 points (equivalent to 1500 perfect games)'),
('ach_score_2000000', 'en', 'Legend: 2,000,000 Points', 'Accumulate 2,000,000 points (equivalent to 2000 perfect games)'),
('ach_score_3000000', 'en', 'Legend: 3,000,000 Points', 'Accumulate 3,000,000 points (equivalent to 3000 perfect games)'),
('ach_score_5000000', 'en', 'Legend: 5,000,000 Points', 'Accumulate 5,000,000 points (equivalent to 5000 perfect games)');

-- French (fr)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_score_1000', 'fr', 'Collectionneur: 1 000 Points', 'Accumulez 1 000 points (équivalent à 1 partie parfaite)'),
('ach_score_2500', 'fr', 'Collectionneur: 2 500 Points', 'Accumulez 2 500 points (équivalent à 2-3 parties parfaites)'),
('ach_score_5000', 'fr', 'Collectionneur: 5 000 Points', 'Accumulez 5 000 points (équivalent à 5 parties parfaites)'),
('ach_score_10000', 'fr', 'Chasseur de Points: 10 000 Points', 'Accumulez 10 000 points (équivalent à 10 parties parfaites)'),
('ach_score_25000', 'fr', 'Chasseur de Points: 25 000 Points', 'Accumulez 25 000 points (équivalent à 25 parties parfaites)'),
('ach_score_50000', 'fr', 'Chasseur de Points: 50 000 Points', 'Accumulez 50 000 points (équivalent à 50 parties parfaites)'),
('ach_score_75000', 'fr', 'Aimant à Points: 75 000 Points', 'Accumulez 75 000 points (équivalent à 75 parties parfaites)'),
('ach_score_100000', 'fr', 'Aimant à Points: 100 000 Points', 'Accumulez 100 000 points (équivalent à 100 parties parfaites)'),
('ach_score_150000', 'fr', 'Aimant à Points: 150 000 Points', 'Accumulez 150 000 points (équivalent à 150 parties parfaites)'),
('ach_score_200000', 'fr', 'Maître des Points: 200 000 Points', 'Accumulez 200 000 points (équivalent à 200 parties parfaites)'),
('ach_score_300000', 'fr', 'Maître des Points: 300 000 Points', 'Accumulez 300 000 points (équivalent à 300 parties parfaites)'),
('ach_score_500000', 'fr', 'Maître des Points: 500 000 Points', 'Accumulez 500 000 points (équivalent à 500 parties parfaites)'),
('ach_score_750000', 'fr', 'Élite: 750 000 Points', 'Accumulez 750 000 points (équivalent à 750 parties parfaites)'),
('ach_score_1000000', 'fr', 'Élite: 1 000 000 Points', 'Accumulez 1 000 000 points (équivalent à 1000 parties parfaites)'),
('ach_score_1500000', 'fr', 'Élite: 1 500 000 Points', 'Accumulez 1 500 000 points (équivalent à 1500 parties parfaites)'),
('ach_score_2000000', 'fr', 'Légende: 2 000 000 Points', 'Accumulez 2 000 000 points (équivalent à 2000 parties parfaites)'),
('ach_score_3000000', 'fr', 'Légende: 3 000 000 Points', 'Accumulez 3 000 000 points (équivalent à 3000 parties parfaites)'),
('ach_score_5000000', 'fr', 'Légende: 5 000 000 Points', 'Accumulez 5 000 000 points (équivalent à 5000 parties parfaites)');

-- Spanish (es)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_score_1000', 'es', 'Coleccionista: 1.000 Puntos', 'Acumula 1.000 puntos (equivalente a 1 juego perfecto)'),
('ach_score_2500', 'es', 'Coleccionista: 2.500 Puntos', 'Acumula 2.500 puntos (equivalente a 2-3 juegos perfectos)'),
('ach_score_5000', 'es', 'Coleccionista: 5.000 Puntos', 'Acumula 5.000 puntos (equivalente a 5 juegos perfectos)'),
('ach_score_10000', 'es', 'Cazador de Puntos: 10.000 Puntos', 'Acumula 10.000 puntos (equivalente a 10 juegos perfectos)'),
('ach_score_25000', 'es', 'Cazador de Puntos: 25.000 Puntos', 'Acumula 25.000 puntos (equivalente a 25 juegos perfectos)'),
('ach_score_50000', 'es', 'Cazador de Puntos: 50.000 Puntos', 'Acumula 50.000 puntos (equivalente a 50 juegos perfectos)'),
('ach_score_75000', 'es', 'Imán de Puntos: 75.000 Puntos', 'Acumula 75.000 puntos (equivalente a 75 juegos perfectos)'),
('ach_score_100000', 'es', 'Imán de Puntos: 100.000 Puntos', 'Acumula 100.000 puntos (equivalente a 100 juegos perfectos)'),
('ach_score_150000', 'es', 'Imán de Puntos: 150.000 Puntos', 'Acumula 150.000 puntos (equivalente a 150 juegos perfectos)'),
('ach_score_200000', 'es', 'Maestro de Puntos: 200.000 Puntos', 'Acumula 200.000 puntos (equivalente a 200 juegos perfectos)'),
('ach_score_300000', 'es', 'Maestro de Puntos: 300.000 Puntos', 'Acumula 300.000 puntos (equivalente a 300 juegos perfectos)'),
('ach_score_500000', 'es', 'Maestro de Puntos: 500.000 Puntos', 'Acumula 500.000 puntos (equivalente a 500 juegos perfectos)'),
('ach_score_750000', 'es', 'Élite: 750.000 Puntos', 'Acumula 750.000 puntos (equivalente a 750 juegos perfectos)'),
('ach_score_1000000', 'es', 'Élite: 1.000.000 Puntos', 'Acumula 1.000.000 puntos (equivalente a 1000 juegos perfectos)'),
('ach_score_1500000', 'es', 'Élite: 1.500.000 Puntos', 'Acumula 1.500.000 puntos (equivalente a 1500 juegos perfectos)'),
('ach_score_2000000', 'es', 'Leyenda: 2.000.000 Puntos', 'Acumula 2.000.000 puntos (equivalente a 2000 juegos perfectos)'),
('ach_score_3000000', 'es', 'Leyenda: 3.000.000 Puntos', 'Acumula 3.000.000 puntos (equivalente a 3000 juegos perfectos)'),
('ach_score_5000000', 'es', 'Leyenda: 5.000.000 Puntos', 'Acumula 5.000.000 puntos (equivalente a 5000 juegos perfectos)');

-- Italian (it)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_score_1000', 'it', 'Collezionista: 1.000 Punti', 'Accumula 1.000 punti (equivalente a 1 partita perfetta)'),
('ach_score_2500', 'it', 'Collezionista: 2.500 Punti', 'Accumula 2.500 punti (equivalente a 2-3 partite perfette)'),
('ach_score_5000', 'it', 'Collezionista: 5.000 Punti', 'Accumula 5.000 punti (equivalente a 5 partite perfette)'),
('ach_score_10000', 'it', 'Cacciatore di Punti: 10.000 Punti', 'Accumula 10.000 punti (equivalente a 10 partite perfette)'),
('ach_score_25000', 'it', 'Cacciatore di Punti: 25.000 Punti', 'Accumula 25.000 punti (equivalente a 25 partite perfette)'),
('ach_score_50000', 'it', 'Cacciatore di Punti: 50.000 Punti', 'Accumula 50.000 punti (equivalente a 50 partite perfette)'),
('ach_score_75000', 'it', 'Magnete di Punti: 75.000 Punti', 'Accumula 75.000 punti (equivalente a 75 partite perfette)'),
('ach_score_100000', 'it', 'Magnete di Punti: 100.000 Punti', 'Accumula 100.000 punti (equivalente a 100 partite perfette)'),
('ach_score_150000', 'it', 'Magnete di Punti: 150.000 Punti', 'Accumula 150.000 punti (equivalente a 150 partite perfette)'),
('ach_score_200000', 'it', 'Maestro dei Punti: 200.000 Punti', 'Accumula 200.000 punti (equivalente a 200 partite perfette)'),
('ach_score_300000', 'it', 'Maestro dei Punti: 300.000 Punti', 'Accumula 300.000 punti (equivalente a 300 partite perfette)'),
('ach_score_500000', 'it', 'Maestro dei Punti: 500.000 Punti', 'Accumula 500.000 punti (equivalente a 500 partite perfette)'),
('ach_score_750000', 'it', 'Elite: 750.000 Punti', 'Accumula 750.000 punti (equivalente a 750 partite perfette)'),
('ach_score_1000000', 'it', 'Elite: 1.000.000 Punti', 'Accumula 1.000.000 punti (equivalente a 1000 partite perfette)'),
('ach_score_1500000', 'it', 'Elite: 1.500.000 Punti', 'Accumula 1.500.000 punti (equivalente a 1500 partite perfette)'),
('ach_score_2000000', 'it', 'Leggenda: 2.000.000 Punti', 'Accumula 2.000.000 punti (equivalente a 2000 partite perfette)'),
('ach_score_3000000', 'it', 'Leggenda: 3.000.000 Punti', 'Accumula 3.000.000 punti (equivalente a 3000 partite perfette)'),
('ach_score_5000000', 'it', 'Leggenda: 5.000.000 Punti', 'Accumula 5.000.000 punti (equivalente a 5000 partite perfette)');

-- Portuguese (pt)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_score_1000', 'pt', 'Colecionador: 1.000 Pontos', 'Acumule 1.000 pontos (equivalente a 1 jogo perfeito)'),
('ach_score_2500', 'pt', 'Colecionador: 2.500 Pontos', 'Acumule 2.500 pontos (equivalente a 2-3 jogos perfeitos)'),
('ach_score_5000', 'pt', 'Colecionador: 5.000 Pontos', 'Acumule 5.000 pontos (equivalente a 5 jogos perfeitos)'),
('ach_score_10000', 'pt', 'Caçador de Pontos: 10.000 Pontos', 'Acumule 10.000 pontos (equivalente a 10 jogos perfeitos)'),
('ach_score_25000', 'pt', 'Caçador de Pontos: 25.000 Pontos', 'Acumule 25.000 pontos (equivalente a 25 jogos perfeitos)'),
('ach_score_50000', 'pt', 'Caçador de Pontos: 50.000 Pontos', 'Acumule 50.000 pontos (equivalente a 50 jogos perfeitos)'),
('ach_score_75000', 'pt', 'Ímã de Pontos: 75.000 Pontos', 'Acumule 75.000 pontos (equivalente a 75 jogos perfeitos)'),
('ach_score_100000', 'pt', 'Ímã de Pontos: 100.000 Pontos', 'Acumule 100.000 pontos (equivalente a 100 jogos perfeitos)'),
('ach_score_150000', 'pt', 'Ímã de Pontos: 150.000 Pontos', 'Acumule 150.000 pontos (equivalente a 150 jogos perfeitos)'),
('ach_score_200000', 'pt', 'Mestre de Pontos: 200.000 Pontos', 'Acumule 200.000 pontos (equivalente a 200 jogos perfeitos)'),
('ach_score_300000', 'pt', 'Mestre de Pontos: 300.000 Pontos', 'Acumule 300.000 pontos (equivalente a 300 jogos perfeitos)'),
('ach_score_500000', 'pt', 'Mestre de Pontos: 500.000 Pontos', 'Acumule 500.000 pontos (equivalente a 500 jogos perfeitos)'),
('ach_score_750000', 'pt', 'Elite: 750.000 Pontos', 'Acumule 750.000 pontos (equivalente a 750 jogos perfeitos)'),
('ach_score_1000000', 'pt', 'Elite: 1.000.000 Pontos', 'Acumule 1.000.000 pontos (equivalente a 1000 jogos perfeitos)'),
('ach_score_1500000', 'pt', 'Elite: 1.500.000 Pontos', 'Acumule 1.500.000 pontos (equivalente a 1500 jogos perfeitos)'),
('ach_score_2000000', 'pt', 'Lenda: 2.000.000 Pontos', 'Acumule 2.000.000 pontos (equivalente a 2000 jogos perfeitos)'),
('ach_score_3000000', 'pt', 'Lenda: 3.000.000 Pontos', 'Acumule 3.000.000 pontos (equivalente a 3000 jogos perfeitos)'),
('ach_score_5000000', 'pt', 'Lenda: 5.000.000 Pontos', 'Acumule 5.000.000 pontos (equivalente a 5000 jogos perfeitos)');

-- Danish (da)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_score_1000', 'da', 'Samler: 1.000 Point', 'Akkumuler 1.000 point (svarende til 1 perfekt spil)'),
('ach_score_2500', 'da', 'Samler: 2.500 Point', 'Akkumuler 2.500 point (svarende til 2-3 perfekte spil)'),
('ach_score_5000', 'da', 'Samler: 5.000 Point', 'Akkumuler 5.000 point (svarende til 5 perfekte spil)'),
('ach_score_10000', 'da', 'Pointjæger: 10.000 Point', 'Akkumuler 10.000 point (svarende til 10 perfekte spil)'),
('ach_score_25000', 'da', 'Pointjæger: 25.000 Point', 'Akkumuler 25.000 point (svarende til 25 perfekte spil)'),
('ach_score_50000', 'da', 'Pointjæger: 50.000 Point', 'Akkumuler 50.000 point (svarende til 50 perfekte spil)'),
('ach_score_75000', 'da', 'Pointmagnet: 75.000 Point', 'Akkumuler 75.000 point (svarende til 75 perfekte spil)'),
('ach_score_100000', 'da', 'Pointmagnet: 100.000 Point', 'Akkumuler 100.000 point (svarende til 100 perfekte spil)'),
('ach_score_150000', 'da', 'Pointmagnet: 150.000 Point', 'Akkumuler 150.000 point (svarende til 150 perfekte spil)'),
('ach_score_200000', 'da', 'Pointmester: 200.000 Point', 'Akkumuler 200.000 point (svarende til 200 perfekte spil)'),
('ach_score_300000', 'da', 'Pointmester: 300.000 Point', 'Akkumuler 300.000 point (svarende til 300 perfekte spil)'),
('ach_score_500000', 'da', 'Pointmester: 500.000 Point', 'Akkumuler 500.000 point (svarende til 500 perfekte spil)'),
('ach_score_750000', 'da', 'Elite: 750.000 Point', 'Akkumuler 750.000 point (svarende til 750 perfekte spil)'),
('ach_score_1000000', 'da', 'Elite: 1.000.000 Point', 'Akkumuler 1.000.000 point (svarende til 1000 perfekte spil)'),
('ach_score_1500000', 'da', 'Elite: 1.500.000 Point', 'Akkumuler 1.500.000 point (svarende til 1500 perfekte spil)'),
('ach_score_2000000', 'da', 'Legende: 2.000.000 Point', 'Akkumuler 2.000.000 point (svarende til 2000 perfekte spil)'),
('ach_score_3000000', 'da', 'Legende: 3.000.000 Point', 'Akkumuler 3.000.000 point (svarende til 3000 perfekte spil)'),
('ach_score_5000000', 'da', 'Legende: 5.000.000 Point', 'Akkumuler 5.000.000 point (svarende til 5000 perfekte spil)');

-- Dutch (nl)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_score_1000', 'nl', 'Verzamelaar: 1.000 Punten', 'Verzamel 1.000 punten (gelijk aan 1 perfect spel)'),
('ach_score_2500', 'nl', 'Verzamelaar: 2.500 Punten', 'Verzamel 2.500 punten (gelijk aan 2-3 perfecte spellen)'),
('ach_score_5000', 'nl', 'Verzamelaar: 5.000 Punten', 'Verzamel 5.000 punten (gelijk aan 5 perfecte spellen)'),
('ach_score_10000', 'nl', 'Puntenjager: 10.000 Punten', 'Verzamel 10.000 punten (gelijk aan 10 perfecte spellen)'),
('ach_score_25000', 'nl', 'Puntenjager: 25.000 Punten', 'Verzamel 25.000 punten (gelijk aan 25 perfecte spellen)'),
('ach_score_50000', 'nl', 'Puntenjager: 50.000 Punten', 'Verzamel 50.000 punten (gelijk aan 50 perfecte spellen)'),
('ach_score_75000', 'nl', 'Puntenmagneet: 75.000 Punten', 'Verzamel 75.000 punten (gelijk aan 75 perfecte spellen)'),
('ach_score_100000', 'nl', 'Puntenmagneet: 100.000 Punten', 'Verzamel 100.000 punten (gelijk aan 100 perfecte spellen)'),
('ach_score_150000', 'nl', 'Puntenmagneet: 150.000 Punten', 'Verzamel 150.000 punten (gelijk aan 150 perfecte spellen)'),
('ach_score_200000', 'nl', 'Puntenmeester: 200.000 Punten', 'Verzamel 200.000 punten (gelijk aan 200 perfecte spellen)'),
('ach_score_300000', 'nl', 'Puntenmeester: 300.000 Punten', 'Verzamel 300.000 punten (gelijk aan 300 perfecte spellen)'),
('ach_score_500000', 'nl', 'Puntenmeester: 500.000 Punten', 'Verzamel 500.000 punten (gelijk aan 500 perfecte spellen)'),
('ach_score_750000', 'nl', 'Elite: 750.000 Punten', 'Verzamel 750.000 punten (gelijk aan 750 perfecte spellen)'),
('ach_score_1000000', 'nl', 'Elite: 1.000.000 Punten', 'Verzamel 1.000.000 punten (gelijk aan 1000 perfecte spellen)'),
('ach_score_1500000', 'nl', 'Elite: 1.500.000 Punten', 'Verzamel 1.500.000 punten (gelijk aan 1500 perfecte spellen)'),
('ach_score_2000000', 'nl', 'Legende: 2.000.000 Punten', 'Verzamel 2.000.000 punten (gelijk aan 2000 perfecte spellen)'),
('ach_score_3000000', 'nl', 'Legende: 3.000.000 Punten', 'Verzamel 3.000.000 punten (gelijk aan 3000 perfecte spellen)'),
('ach_score_5000000', 'nl', 'Legende: 5.000.000 Punten', 'Verzamel 5.000.000 punten (gelijk aan 5000 perfecte spellen)');

-- Swedish (sv)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_score_1000', 'sv', 'Samlare: 1 000 Poäng', 'Samla 1 000 poäng (motsvarar 1 perfekt spel)'),
('ach_score_2500', 'sv', 'Samlare: 2 500 Poäng', 'Samla 2 500 poäng (motsvarar 2-3 perfekta spel)'),
('ach_score_5000', 'sv', 'Samlare: 5 000 Poäng', 'Samla 5 000 poäng (motsvarar 5 perfekta spel)'),
('ach_score_10000', 'sv', 'Poängjägare: 10 000 Poäng', 'Samla 10 000 poäng (motsvarar 10 perfekta spel)'),
('ach_score_25000', 'sv', 'Poängjägare: 25 000 Poäng', 'Samla 25 000 poäng (motsvarar 25 perfekta spel)'),
('ach_score_50000', 'sv', 'Poängjägare: 50 000 Poäng', 'Samla 50 000 poäng (motsvarar 50 perfekta spel)'),
('ach_score_75000', 'sv', 'Poängmagnet: 75 000 Poäng', 'Samla 75 000 poäng (motsvarar 75 perfekta spel)'),
('ach_score_100000', 'sv', 'Poängmagnet: 100 000 Poäng', 'Samla 100 000 poäng (motsvarar 100 perfekta spel)'),
('ach_score_150000', 'sv', 'Poängmagnet: 150 000 Poäng', 'Samla 150 000 poäng (motsvarar 150 perfekta spel)'),
('ach_score_200000', 'sv', 'Poängmästare: 200 000 Poäng', 'Samla 200 000 poäng (motsvarar 200 perfekta spel)'),
('ach_score_300000', 'sv', 'Poängmästare: 300 000 Poäng', 'Samla 300 000 poäng (motsvarar 300 perfekta spel)'),
('ach_score_500000', 'sv', 'Poängmästare: 500 000 Poäng', 'Samla 500 000 poäng (motsvarar 500 perfekta spel)'),
('ach_score_750000', 'sv', 'Elit: 750 000 Poäng', 'Samla 750 000 poäng (motsvarar 750 perfekta spel)'),
('ach_score_1000000', 'sv', 'Elit: 1 000 000 Poäng', 'Samla 1 000 000 poäng (motsvarar 1000 perfekta spel)'),
('ach_score_1500000', 'sv', 'Elit: 1 500 000 Poäng', 'Samla 1 500 000 poäng (motsvarar 1500 perfekta spel)'),
('ach_score_2000000', 'sv', 'Legend: 2 000 000 Poäng', 'Samla 2 000 000 poäng (motsvarar 2000 perfekta spel)'),
('ach_score_3000000', 'sv', 'Legend: 3 000 000 Poäng', 'Samla 3 000 000 poäng (motsvarar 3000 perfekta spel)'),
('ach_score_5000000', 'sv', 'Legend: 5 000 000 Poäng', 'Samla 5 000 000 poäng (motsvarar 5000 perfekta spel)');

-- Finnish (fi)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_score_1000', 'fi', 'Keräilijä: 1 000 Pistettä', 'Kerää 1 000 pistettä (vastaa 1 täydellistä peliä)'),
('ach_score_2500', 'fi', 'Keräilijä: 2 500 Pistettä', 'Kerää 2 500 pistettä (vastaa 2-3 täydellistä peliä)'),
('ach_score_5000', 'fi', 'Keräilijä: 5 000 Pistettä', 'Kerää 5 000 pistettä (vastaa 5 täydellistä peliä)'),
('ach_score_10000', 'fi', 'Pistemetsästäjä: 10 000 Pistettä', 'Kerää 10 000 pistettä (vastaa 10 täydellistä peliä)'),
('ach_score_25000', 'fi', 'Pistemetsästäjä: 25 000 Pistettä', 'Kerää 25 000 pistettä (vastaa 25 täydellistä peliä)'),
('ach_score_50000', 'fi', 'Pistemetsästäjä: 50 000 Pistettä', 'Kerää 50 000 pistettä (vastaa 50 täydellistä peliä)'),
('ach_score_75000', 'fi', 'Pistemagneetti: 75 000 Pistettä', 'Kerää 75 000 pistettä (vastaa 75 täydellistä peliä)'),
('ach_score_100000', 'fi', 'Pistemagneetti: 100 000 Pistettä', 'Kerää 100 000 pistettä (vastaa 100 täydellistä peliä)'),
('ach_score_150000', 'fi', 'Pistemagneetti: 150 000 Pistettä', 'Kerää 150 000 pistettä (vastaa 150 täydellistä peliä)'),
('ach_score_200000', 'fi', 'Pistemestari: 200 000 Pistettä', 'Kerää 200 000 pistettä (vastaa 200 täydellistä peliä)'),
('ach_score_300000', 'fi', 'Pistemestari: 300 000 Pistettä', 'Kerää 300 000 pistettä (vastaa 300 täydellistä peliä)'),
('ach_score_500000', 'fi', 'Pistemestari: 500 000 Pistettä', 'Kerää 500 000 pistettä (vastaa 500 täydellistä peliä)'),
('ach_score_750000', 'fi', 'Eliitti: 750 000 Pistettä', 'Kerää 750 000 pistettä (vastaa 750 täydellistä peliä)'),
('ach_score_1000000', 'fi', 'Eliitti: 1 000 000 Pistettä', 'Kerää 1 000 000 pistettä (vastaa 1000 täydellistä peliä)'),
('ach_score_1500000', 'fi', 'Eliitti: 1 500 000 Pistettä', 'Kerää 1 500 000 pistettä (vastaa 1500 täydellistä peliä)'),
('ach_score_2000000', 'fi', 'Legenda: 2 000 000 Pistettä', 'Kerää 2 000 000 pistettä (vastaa 2000 täydellistä peliä)'),
('ach_score_3000000', 'fi', 'Legenda: 3 000 000 Pistettä', 'Kerää 3 000 000 pistettä (vastaa 3000 täydellistä peliä)'),
('ach_score_5000000', 'fi', 'Legenda: 5 000 000 Pistettä', 'Kerää 5 000 000 pistettä (vastaa 5000 täydellistä peliä)');

-- =============================================
-- Daily Streak Achievements
-- =============================================

-- German (de)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_streak_1', 'de', 'Tägliche Serie: 1 Tag', 'Spiele mindestens ein Spiel an einem Tag'),
('ach_streak_3', 'de', 'Tägliche Serie: 3 Tage', 'Spiele mindestens ein Spiel an 3 aufeinanderfolgenden Tagen'),
('ach_streak_5', 'de', 'Tägliche Serie: 5 Tage', 'Spiele mindestens ein Spiel an 5 aufeinanderfolgenden Tagen'),
('ach_streak_7', 'de', 'Tägliche Serie: 7 Tage', 'Spiele mindestens ein Spiel an 7 aufeinanderfolgenden Tagen'),
('ach_streak_10', 'de', 'Tägliche Serie: 10 Tage', 'Spiele mindestens ein Spiel an 10 aufeinanderfolgenden Tagen'),
('ach_streak_14', 'de', 'Tägliche Serie: 14 Tage', 'Spiele mindestens ein Spiel an 14 aufeinanderfolgenden Tagen'),
('ach_streak_21', 'de', 'Tägliche Serie: 21 Tage', 'Spiele mindestens ein Spiel an 21 aufeinanderfolgenden Tagen'),
('ach_streak_30', 'de', 'Tägliche Serie: 30 Tage', 'Spiele mindestens ein Spiel an 30 aufeinanderfolgenden Tagen'),
('ach_streak_45', 'de', 'Tägliche Serie: 45 Tage', 'Spiele mindestens ein Spiel an 45 aufeinanderfolgenden Tagen'),
('ach_streak_60', 'de', 'Tägliche Serie: 60 Tage', 'Spiele mindestens ein Spiel an 60 aufeinanderfolgenden Tagen'),
('ach_streak_90', 'de', 'Tägliche Serie: 90 Tage', 'Spiele mindestens ein Spiel an 90 aufeinanderfolgenden Tagen'),
('ach_streak_120', 'de', 'Tägliche Serie: 120 Tage', 'Spiele mindestens ein Spiel an 120 aufeinanderfolgenden Tagen'),
('ach_streak_180', 'de', 'Tägliche Serie: 180 Tage', 'Spiele mindestens ein Spiel an 180 aufeinanderfolgenden Tagen'),
('ach_streak_270', 'de', 'Tägliche Serie: 270 Tage', 'Spiele mindestens ein Spiel an 270 aufeinanderfolgenden Tagen'),
('ach_streak_365', 'de', 'Tägliche Serie: 365 Tage', 'Spiele mindestens ein Spiel an 365 aufeinanderfolgenden Tagen');

-- English (en)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_streak_1', 'en', 'Daily Streak: 1 Day', 'Play at least one game on 1 day'),
('ach_streak_3', 'en', 'Daily Streak: 3 Days', 'Play at least one game on 3 consecutive days'),
('ach_streak_5', 'en', 'Daily Streak: 5 Days', 'Play at least one game on 5 consecutive days'),
('ach_streak_7', 'en', 'Daily Streak: 7 Days', 'Play at least one game on 7 consecutive days'),
('ach_streak_10', 'en', 'Daily Streak: 10 Days', 'Play at least one game on 10 consecutive days'),
('ach_streak_14', 'en', 'Daily Streak: 14 Days', 'Play at least one game on 14 consecutive days'),
('ach_streak_21', 'en', 'Daily Streak: 21 Days', 'Play at least one game on 21 consecutive days'),
('ach_streak_30', 'en', 'Daily Streak: 30 Days', 'Play at least one game on 30 consecutive days'),
('ach_streak_45', 'en', 'Daily Streak: 45 Days', 'Play at least one game on 45 consecutive days'),
('ach_streak_60', 'en', 'Daily Streak: 60 Days', 'Play at least one game on 60 consecutive days'),
('ach_streak_90', 'en', 'Daily Streak: 90 Days', 'Play at least one game on 90 consecutive days'),
('ach_streak_120', 'en', 'Daily Streak: 120 Days', 'Play at least one game on 120 consecutive days'),
('ach_streak_180', 'en', 'Daily Streak: 180 Days', 'Play at least one game on 180 consecutive days'),
('ach_streak_270', 'en', 'Daily Streak: 270 Days', 'Play at least one game on 270 consecutive days'),
('ach_streak_365', 'en', 'Daily Streak: 365 Days', 'Play at least one game on 365 consecutive days');

-- French (fr)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_streak_1', 'fr', 'Série quotidienne: 1 jour', 'Jouez au moins une partie par jour pendant 1 jour'),
('ach_streak_3', 'fr', 'Série quotidienne: 3 jours', 'Jouez au moins une partie par jour pendant 3 jours consécutifs'),
('ach_streak_5', 'fr', 'Série quotidienne: 5 jours', 'Jouez au moins une partie par jour pendant 5 jours consécutifs'),
('ach_streak_7', 'fr', 'Série quotidienne: 7 jours', 'Jouez au moins une partie par jour pendant 7 jours consécutifs'),
('ach_streak_10', 'fr', 'Série quotidienne: 10 jours', 'Jouez au moins une partie par jour pendant 10 jours consécutifs'),
('ach_streak_14', 'fr', 'Série quotidienne: 14 jours', 'Jouez au moins une partie par jour pendant 14 jours consécutifs'),
('ach_streak_21', 'fr', 'Série quotidienne: 21 jours', 'Jouez au moins une partie par jour pendant 21 jours consécutifs'),
('ach_streak_30', 'fr', 'Série quotidienne: 30 jours', 'Jouez au moins une partie par jour pendant 30 jours consécutifs'),
('ach_streak_45', 'fr', 'Série quotidienne: 45 jours', 'Jouez au moins une partie par jour pendant 45 jours consécutifs'),
('ach_streak_60', 'fr', 'Série quotidienne: 60 jours', 'Jouez au moins une partie par jour pendant 60 jours consécutifs'),
('ach_streak_90', 'fr', 'Série quotidienne: 90 jours', 'Jouez au moins une partie par jour pendant 90 jours consécutifs'),
('ach_streak_120', 'fr', 'Série quotidienne: 120 jours', 'Jouez au moins une partie par jour pendant 120 jours consécutifs'),
('ach_streak_180', 'fr', 'Série quotidienne: 180 jours', 'Jouez au moins une partie par jour pendant 180 jours consécutifs'),
('ach_streak_270', 'fr', 'Série quotidienne: 270 jours', 'Jouez au moins une partie par jour pendant 270 jours consécutifs'),
('ach_streak_365', 'fr', 'Série quotidienne: 365 jours', 'Jouez au moins une partie par jour pendant 365 jours consécutifs');

-- Spanish (es)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_streak_1', 'es', 'Racha diaria: 1 día', 'Juega al menos un juego por día durante 1 día'),
('ach_streak_3', 'es', 'Racha diaria: 3 días', 'Juega al menos un juego por día durante 3 días consecutivos'),
('ach_streak_5', 'es', 'Racha diaria: 5 días', 'Juega al menos un juego por día durante 5 días consecutivos'),
('ach_streak_7', 'es', 'Racha diaria: 7 días', 'Juega al menos un juego por día durante 7 días consecutivos'),
('ach_streak_10', 'es', 'Racha diaria: 10 días', 'Juega al menos un juego por día durante 10 días consecutivos'),
('ach_streak_14', 'es', 'Racha diaria: 14 días', 'Juega al menos un juego por día durante 14 días consecutivos'),
('ach_streak_21', 'es', 'Racha diaria: 21 días', 'Juega al menos un juego por día durante 21 días consecutivos'),
('ach_streak_30', 'es', 'Racha diaria: 30 días', 'Juega al menos un juego por día durante 30 días consecutivos'),
('ach_streak_45', 'es', 'Racha diaria: 45 días', 'Juega al menos un juego por día durante 45 días consecutivos'),
('ach_streak_60', 'es', 'Racha diaria: 60 días', 'Juega al menos un juego por día durante 60 días consecutivos'),
('ach_streak_90', 'es', 'Racha diaria: 90 días', 'Juega al menos un juego por día durante 90 días consecutivos'),
('ach_streak_120', 'es', 'Racha diaria: 120 días', 'Juega al menos un juego por día durante 120 días consecutivos'),
('ach_streak_180', 'es', 'Racha diaria: 180 días', 'Juega al menos un juego por día durante 180 días consecutivos'),
('ach_streak_270', 'es', 'Racha diaria: 270 días', 'Juega al menos un juego por día durante 270 días consecutivos'),
('ach_streak_365', 'es', 'Racha diaria: 365 días', 'Juega al menos un juego por día durante 365 días consecutivos');

-- Italian (it)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_streak_1', 'it', 'Serie giornaliera: 1 giorno', 'Gioca almeno una partita al giorno per 1 giorno'),
('ach_streak_3', 'it', 'Serie giornaliera: 3 giorni', 'Gioca almeno una partita al giorno per 3 giorni consecutivi'),
('ach_streak_5', 'it', 'Serie giornaliera: 5 giorni', 'Gioca almeno una partita al giorno per 5 giorni consecutivi'),
('ach_streak_7', 'it', 'Serie giornaliera: 7 giorni', 'Gioca almeno una partita al giorno per 7 giorni consecutivi'),
('ach_streak_10', 'it', 'Serie giornaliera: 10 giorni', 'Gioca almeno una partita al giorno per 10 giorni consecutivi'),
('ach_streak_14', 'it', 'Serie giornaliera: 14 giorni', 'Gioca almeno una partita al giorno per 14 giorni consecutivi'),
('ach_streak_21', 'it', 'Serie giornaliera: 21 giorni', 'Gioca almeno una partita al giorno per 21 giorni consecutivi'),
('ach_streak_30', 'it', 'Serie giornaliera: 30 giorni', 'Gioca almeno una partita al giorno per 30 giorni consecutivi'),
('ach_streak_45', 'it', 'Serie giornaliera: 45 giorni', 'Gioca almeno una partita al giorno per 45 giorni consecutivi'),
('ach_streak_60', 'it', 'Serie giornaliera: 60 giorni', 'Gioca almeno una partita al giorno per 60 giorni consecutivi'),
('ach_streak_90', 'it', 'Serie giornaliera: 90 giorni', 'Gioca almeno una partita al giorno per 90 giorni consecutivi'),
('ach_streak_120', 'it', 'Serie giornaliera: 120 giorni', 'Gioca almeno una partita al giorno per 120 giorni consecutivi'),
('ach_streak_180', 'it', 'Serie giornaliera: 180 giorni', 'Gioca almeno una partita al giorno per 180 giorni consecutivi'),
('ach_streak_270', 'it', 'Serie giornaliera: 270 giorni', 'Gioca almeno una partita al giorno per 270 giorni consecutivi'),
('ach_streak_365', 'it', 'Serie giornaliera: 365 giorni', 'Gioca almeno una partita al giorno per 365 giorni consecutivi');

-- Portuguese (pt)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_streak_1', 'pt', 'Sequência diária: 1 dia', 'Jogue pelo menos um jogo por dia durante 1 dia'),
('ach_streak_3', 'pt', 'Sequência diária: 3 dias', 'Jogue pelo menos um jogo por dia durante 3 dias consecutivos'),
('ach_streak_5', 'pt', 'Sequência diária: 5 dias', 'Jogue pelo menos um jogo por dia durante 5 dias consecutivos'),
('ach_streak_7', 'pt', 'Sequência diária: 7 dias', 'Jogue pelo menos um jogo por dia durante 7 dias consecutivos'),
('ach_streak_10', 'pt', 'Sequência diária: 10 dias', 'Jogue pelo menos um jogo por dia durante 10 dias consecutivos'),
('ach_streak_14', 'pt', 'Sequência diária: 14 dias', 'Jogue pelo menos um jogo por dia durante 14 dias consecutivos'),
('ach_streak_21', 'pt', 'Sequência diária: 21 dias', 'Jogue pelo menos um jogo por dia durante 21 dias consecutivos'),
('ach_streak_30', 'pt', 'Sequência diária: 30 dias', 'Jogue pelo menos um jogo por dia durante 30 dias consecutivos'),
('ach_streak_45', 'pt', 'Sequência diária: 45 dias', 'Jogue pelo menos um jogo por dia durante 45 dias consecutivos'),
('ach_streak_60', 'pt', 'Sequência diária: 60 dias', 'Jogue pelo menos um jogo por dia durante 60 dias consecutivos'),
('ach_streak_90', 'pt', 'Sequência diária: 90 dias', 'Jogue pelo menos um jogo por dia durante 90 dias consecutivos'),
('ach_streak_120', 'pt', 'Sequência diária: 120 dias', 'Jogue pelo menos um jogo por dia durante 120 dias consecutivos'),
('ach_streak_180', 'pt', 'Sequência diária: 180 dias', 'Jogue pelo menos um jogo por dia durante 180 dias consecutivos'),
('ach_streak_270', 'pt', 'Sequência diária: 270 dias', 'Jogue pelo menos um jogo por dia durante 270 dias consecutivos'),
('ach_streak_365', 'pt', 'Sequência diária: 365 dias', 'Jogue pelo menos um jogo por dia durante 365 dias consecutivos');

-- Danish (da)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_streak_1', 'da', 'Daglig streak: 1 dag', 'Spil mindst ét spil om dagen i 1 dag'),
('ach_streak_3', 'da', 'Daglig streak: 3 dage', 'Spil mindst ét spil om dagen i 3 dage i træk'),
('ach_streak_5', 'da', 'Daglig streak: 5 dage', 'Spil mindst ét spil om dagen i 5 dage i træk'),
('ach_streak_7', 'da', 'Daglig streak: 7 dage', 'Spil mindst ét spil om dagen i 7 dage i træk'),
('ach_streak_10', 'da', 'Daglig streak: 10 dage', 'Spil mindst ét spil om dagen i 10 dage i træk'),
('ach_streak_14', 'da', 'Daglig streak: 14 dage', 'Spil mindst ét spil om dagen i 14 dage i træk'),
('ach_streak_21', 'da', 'Daglig streak: 21 dage', 'Spil mindst ét spil om dagen i 21 dage i træk'),
('ach_streak_30', 'da', 'Daglig streak: 30 dage', 'Spil mindst ét spil om dagen i 30 dage i træk'),
('ach_streak_45', 'da', 'Daglig streak: 45 dage', 'Spil mindst ét spil om dagen i 45 dage i træk'),
('ach_streak_60', 'da', 'Daglig streak: 60 dage', 'Spil mindst ét spil om dagen i 60 dage i træk'),
('ach_streak_90', 'da', 'Daglig streak: 90 dage', 'Spil mindst ét spil om dagen i 90 dage i træk'),
('ach_streak_120', 'da', 'Daglig streak: 120 dage', 'Spil mindst ét spil om dagen i 120 dage i træk'),
('ach_streak_180', 'da', 'Daglig streak: 180 dage', 'Spil mindst ét spil om dagen i 180 dage i træk'),
('ach_streak_270', 'da', 'Daglig streak: 270 dage', 'Spil mindst ét spil om dagen i 270 dage i træk'),
('ach_streak_365', 'da', 'Daglig streak: 365 dage', 'Spil mindst ét spil om dagen i 365 dage i træk');

-- Dutch (nl)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_streak_1', 'nl', 'Dagelijkse reeks: 1 dag', 'Speel minstens één spel per dag gedurende 1 dag'),
('ach_streak_3', 'nl', 'Dagelijkse reeks: 3 dagen', 'Speel minstens één spel per dag gedurende 3 opeenvolgende dagen'),
('ach_streak_5', 'nl', 'Dagelijkse reeks: 5 dagen', 'Speel minstens één spel per dag gedurende 5 opeenvolgende dagen'),
('ach_streak_7', 'nl', 'Dagelijkse reeks: 7 dagen', 'Speel minstens één spel per dag gedurende 7 opeenvolgende dagen'),
('ach_streak_10', 'nl', 'Dagelijkse reeks: 10 dagen', 'Speel minstens één spel per dag gedurende 10 opeenvolgende dagen'),
('ach_streak_14', 'nl', 'Dagelijkse reeks: 14 dagen', 'Speel minstens één spel per dag gedurende 14 opeenvolgende dagen'),
('ach_streak_21', 'nl', 'Dagelijkse reeks: 21 dagen', 'Speel minstens één spel per dag gedurende 21 opeenvolgende dagen'),
('ach_streak_30', 'nl', 'Dagelijkse reeks: 30 dagen', 'Speel minstens één spel per dag gedurende 30 opeenvolgende dagen'),
('ach_streak_45', 'nl', 'Dagelijkse reeks: 45 dagen', 'Speel minstens één spel per dag gedurende 45 opeenvolgende dagen'),
('ach_streak_60', 'nl', 'Dagelijkse reeks: 60 dagen', 'Speel minstens één spel per dag gedurende 60 opeenvolgende dagen'),
('ach_streak_90', 'nl', 'Dagelijkse reeks: 90 dagen', 'Speel minstens één spel per dag gedurende 90 opeenvolgende dagen'),
('ach_streak_120', 'nl', 'Dagelijkse reeks: 120 dagen', 'Speel minstens één spel per dag gedurende 120 opeenvolgende dagen'),
('ach_streak_180', 'nl', 'Dagelijkse reeks: 180 dagen', 'Speel minstens één spel per dag gedurende 180 opeenvolgende dagen'),
('ach_streak_270', 'nl', 'Dagelijkse reeks: 270 dagen', 'Speel minstens één spel per dag gedurende 270 opeenvolgende dagen'),
('ach_streak_365', 'nl', 'Dagelijkse reeks: 365 dagen', 'Speel minstens één spel per dag gedurende 365 opeenvolgende dagen');

-- Swedish (sv)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_streak_1', 'sv', 'Daglig svit: 1 dag', 'Spela minst ett spel per dag i 1 dag'),
('ach_streak_3', 'sv', 'Daglig svit: 3 dagar', 'Spela minst ett spel per dag i 3 dagar i rad'),
('ach_streak_5', 'sv', 'Daglig svit: 5 dagar', 'Spela minst ett spel per dag i 5 dagar i rad'),
('ach_streak_7', 'sv', 'Daglig svit: 7 dagar', 'Spela minst ett spel per dag i 7 dagar i rad'),
('ach_streak_10', 'sv', 'Daglig svit: 10 dagar', 'Spela minst ett spel per dag i 10 dagar i rad'),
('ach_streak_14', 'sv', 'Daglig svit: 14 dagar', 'Spela minst ett spel per dag i 14 dagar i rad'),
('ach_streak_21', 'sv', 'Daglig svit: 21 dagar', 'Spela minst ett spel per dag i 21 dagar i rad'),
('ach_streak_30', 'sv', 'Daglig svit: 30 dagar', 'Spela minst ett spel per dag i 30 dagar i rad'),
('ach_streak_45', 'sv', 'Daglig svit: 45 dagar', 'Spela minst ett spel per dag i 45 dagar i rad'),
('ach_streak_60', 'sv', 'Daglig svit: 60 dagar', 'Spela minst ett spel per dag i 60 dagar i rad'),
('ach_streak_90', 'sv', 'Daglig svit: 90 dagar', 'Spela minst ett spel per dag i 90 dagar i rad'),
('ach_streak_120', 'sv', 'Daglig svit: 120 dagar', 'Spela minst ett spel per dag i 120 dagar i rad'),
('ach_streak_180', 'sv', 'Daglig svit: 180 dagar', 'Spela minst ett spel per dag i 180 dagar i rad'),
('ach_streak_270', 'sv', 'Daglig svit: 270 dagar', 'Spela minst ett spel per dag i 270 dagar i rad'),
('ach_streak_365', 'sv', 'Daglig svit: 365 dagar', 'Spela minst ett spel per dag i 365 dagar i rad');

-- Finnish (fi)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_streak_1', 'fi', 'Päivittäinen putki: 1 päivä', 'Pelaa vähintään yksi peli päivässä 1 päivän ajan'),
('ach_streak_3', 'fi', 'Päivittäinen putki: 3 päivää', 'Pelaa vähintään yksi peli päivässä 3 peräkkäisenä päivänä'),
('ach_streak_5', 'fi', 'Päivittäinen putki: 5 päivää', 'Pelaa vähintään yksi peli päivässä 5 peräkkäisenä päivänä'),
('ach_streak_7', 'fi', 'Päivittäinen putki: 7 päivää', 'Pelaa vähintään yksi peli päivässä 7 peräkkäisenä päivänä'),
('ach_streak_10', 'fi', 'Päivittäinen putki: 10 päivää', 'Pelaa vähintään yksi peli päivässä 10 peräkkäisenä päivänä'),
('ach_streak_14', 'fi', 'Päivittäinen putki: 14 päivää', 'Pelaa vähintään yksi peli päivässä 14 peräkkäisenä päivänä'),
('ach_streak_21', 'fi', 'Päivittäinen putki: 21 päivää', 'Pelaa vähintään yksi peli päivässä 21 peräkkäisenä päivänä'),
('ach_streak_30', 'fi', 'Päivittäinen putki: 30 päivää', 'Pelaa vähintään yksi peli päivässä 30 peräkkäisenä päivänä'),
('ach_streak_45', 'fi', 'Päivittäinen putki: 45 päivää', 'Pelaa vähintään yksi peli päivässä 45 peräkkäisenä päivänä'),
('ach_streak_60', 'fi', 'Päivittäinen putki: 60 päivää', 'Pelaa vähintään yksi peli päivässä 60 peräkkäisenä päivänä'),
('ach_streak_90', 'fi', 'Päivittäinen putki: 90 päivää', 'Pelaa vähintään yksi peli päivässä 90 peräkkäisenä päivänä'),
('ach_streak_120', 'fi', 'Päivittäinen putki: 120 päivää', 'Pelaa vähintään yksi peli päivässä 120 peräkkäisenä päivänä'),
('ach_streak_180', 'fi', 'Päivittäinen putki: 180 päivää', 'Pelaa vähintään yksi peli päivässä 180 peräkkäisenä päivänä'),
('ach_streak_270', 'fi', 'Päivittäinen putki: 270 päivää', 'Pelaa vähintään yksi peli päivässä 270 peräkkäisenä päivänä'),
('ach_streak_365', 'fi', 'Päivittäinen putki: 365 päivää', 'Pelaa vähintään yksi peli päivässä 365 peräkkäisenä päivänä');

-- =============================================
-- Daily Games Achievements
-- =============================================

-- German (de)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_daily_3', 'de', 'Tägliche Spiele: 3 Spiele', 'Spiele 3 Partien an einem einzigen Tag'),
('ach_daily_5', 'de', 'Tägliche Spiele: 5 Spiele', 'Spiele 5 Partien an einem einzigen Tag'),
('ach_daily_7', 'de', 'Tägliche Spiele: 7 Spiele', 'Spiele 7 Partien an einem einzigen Tag'),
('ach_daily_10', 'de', 'Tägliche Spiele: 10 Spiele', 'Spiele 10 Partien an einem einzigen Tag'),
('ach_daily_15', 'de', 'Tägliche Spiele: 15 Spiele', 'Spiele 15 Partien an einem einzigen Tag'),
('ach_daily_20', 'de', 'Tägliche Spiele: 20 Spiele', 'Spiele 20 Partien an einem einzigen Tag'),
('ach_daily_25', 'de', 'Tägliche Spiele: 25 Spiele', 'Spiele 25 Partien an einem einzigen Tag'),
('ach_daily_30', 'de', 'Tägliche Spiele: 30 Spiele', 'Spiele 30 Partien an einem einzigen Tag'),
('ach_daily_40', 'de', 'Tägliche Spiele: 40 Spiele', 'Spiele 40 Partien an einem einzigen Tag'),
('ach_daily_50', 'de', 'Tägliche Spiele: 50 Spiele', 'Spiele 50 Partien an einem einzigen Tag'),
('ach_daily_75', 'de', 'Tägliche Spiele: 75 Spiele', 'Spiele 75 Partien an einem einzigen Tag'),
('ach_daily_100', 'de', 'Tägliche Spiele: 100 Spiele', 'Spiele 100 Partien an einem einzigen Tag'),
('ach_daily_150', 'de', 'Tägliche Spiele: 150 Spiele', 'Spiele 150 Partien an einem einzigen Tag'),
('ach_daily_200', 'de', 'Tägliche Spiele: 200 Spiele', 'Spiele 200 Partien an einem einzigen Tag'),
('ach_daily_250', 'de', 'Tägliche Spiele: 250 Spiele', 'Spiele 250 Partien an einem einzigen Tag');

-- English (en)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_daily_3', 'en', 'Daily Games: 3 Games', 'Play 3 games in a single day'),
('ach_daily_5', 'en', 'Daily Games: 5 Games', 'Play 5 games in a single day'),
('ach_daily_7', 'en', 'Daily Games: 7 Games', 'Play 7 games in a single day'),
('ach_daily_10', 'en', 'Daily Games: 10 Games', 'Play 10 games in a single day'),
('ach_daily_15', 'en', 'Daily Games: 15 Games', 'Play 15 games in a single day'),
('ach_daily_20', 'en', 'Daily Games: 20 Games', 'Play 20 games in a single day'),
('ach_daily_25', 'en', 'Daily Games: 25 Games', 'Play 25 games in a single day'),
('ach_daily_30', 'en', 'Daily Games: 30 Games', 'Play 30 games in a single day'),
('ach_daily_40', 'en', 'Daily Games: 40 Games', 'Play 40 games in a single day'),
('ach_daily_50', 'en', 'Daily Games: 50 Games', 'Play 50 games in a single day'),
('ach_daily_75', 'en', 'Daily Games: 75 Games', 'Play 75 games in a single day'),
('ach_daily_100', 'en', 'Daily Games: 100 Games', 'Play 100 games in a single day'),
('ach_daily_150', 'en', 'Daily Games: 150 Games', 'Play 150 games in a single day'),
('ach_daily_200', 'en', 'Daily Games: 200 Games', 'Play 200 games in a single day'),
('ach_daily_250', 'en', 'Daily Games: 250 Games', 'Play 250 games in a single day');

-- French (fr)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_daily_3', 'fr', 'Jeux quotidiens: 3 parties', 'Jouez à 3 parties en une seule journée'),
('ach_daily_5', 'fr', 'Jeux quotidiens: 5 parties', 'Jouez à 5 parties en une seule journée'),
('ach_daily_7', 'fr', 'Jeux quotidiens: 7 parties', 'Jouez à 7 parties en une seule journée'),
('ach_daily_10', 'fr', 'Jeux quotidiens: 10 parties', 'Jouez à 10 parties en une seule journée'),
('ach_daily_15', 'fr', 'Jeux quotidiens: 15 parties', 'Jouez à 15 parties en une seule journée'),
('ach_daily_20', 'fr', 'Jeux quotidiens: 20 parties', 'Jouez à 20 parties en une seule journée'),
('ach_daily_25', 'fr', 'Jeux quotidiens: 25 parties', 'Jouez à 25 parties en une seule journée'),
('ach_daily_30', 'fr', 'Jeux quotidiens: 30 parties', 'Jouez à 30 parties en une seule journée'),
('ach_daily_40', 'fr', 'Jeux quotidiens: 40 parties', 'Jouez à 40 parties en une seule journée'),
('ach_daily_50', 'fr', 'Jeux quotidiens: 50 parties', 'Jouez à 50 parties en une seule journée'),
('ach_daily_75', 'fr', 'Jeux quotidiens: 75 parties', 'Jouez à 75 parties en une seule journée'),
('ach_daily_100', 'fr', 'Jeux quotidiens: 100 parties', 'Jouez à 100 parties en une seule journée'),
('ach_daily_150', 'fr', 'Jeux quotidiens: 150 parties', 'Jouez à 150 parties en une seule journée'),
('ach_daily_200', 'fr', 'Jeux quotidiens: 200 parties', 'Jouez à 200 parties en une seule journée'),
('ach_daily_250', 'fr', 'Jeux quotidiens: 250 parties', 'Jouez à 250 parties en une seule journée');

-- Spanish (es)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_daily_3', 'es', 'Juegos diarios: 3 juegos', 'Juega 3 partidas en un solo día'),
('ach_daily_5', 'es', 'Juegos diarios: 5 juegos', 'Juega 5 partidas en un solo día'),
('ach_daily_7', 'es', 'Juegos diarios: 7 juegos', 'Juega 7 partidas en un solo día'),
('ach_daily_10', 'es', 'Juegos diarios: 10 juegos', 'Juega 10 partidas en un solo día'),
('ach_daily_15', 'es', 'Juegos diarios: 15 juegos', 'Juega 15 partidas en un solo día'),
('ach_daily_20', 'es', 'Juegos diarios: 20 juegos', 'Juega 20 partidas en un solo día'),
('ach_daily_25', 'es', 'Juegos diarios: 25 juegos', 'Juega 25 partidas en un solo día'),
('ach_daily_30', 'es', 'Juegos diarios: 30 juegos', 'Juega 30 partidas en un solo día'),
('ach_daily_40', 'es', 'Juegos diarios: 40 juegos', 'Juega 40 partidas en un solo día'),
('ach_daily_50', 'es', 'Juegos diarios: 50 juegos', 'Juega 50 partidas en un solo día'),
('ach_daily_75', 'es', 'Juegos diarios: 75 juegos', 'Juega 75 partidas en un solo día'),
('ach_daily_100', 'es', 'Juegos diarios: 100 juegos', 'Juega 100 partidas en un solo día'),
('ach_daily_150', 'es', 'Juegos diarios: 150 juegos', 'Juega 150 partidas en un solo día'),
('ach_daily_200', 'es', 'Juegos diarios: 200 juegos', 'Juega 200 partidas en un solo día'),
('ach_daily_250', 'es', 'Juegos diarios: 250 juegos', 'Juega 250 partidas en un solo día');

-- Italian (it)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_daily_3', 'it', 'Giochi giornalieri: 3 partite', 'Gioca 3 partite in un solo giorno'),
('ach_daily_5', 'it', 'Giochi giornalieri: 5 partite', 'Gioca 5 partite in un solo giorno'),
('ach_daily_7', 'it', 'Giochi giornalieri: 7 partite', 'Gioca 7 partite in un solo giorno'),
('ach_daily_10', 'it', 'Giochi giornalieri: 10 partite', 'Gioca 10 partite in un solo giorno'),
('ach_daily_15', 'it', 'Giochi giornalieri: 15 partite', 'Gioca 15 partite in un solo giorno'),
('ach_daily_20', 'it', 'Giochi giornalieri: 20 partite', 'Gioca 20 partite in un solo giorno'),
('ach_daily_25', 'it', 'Giochi giornalieri: 25 partite', 'Gioca 25 partite in un solo giorno'),
('ach_daily_30', 'it', 'Giochi giornalieri: 30 partite', 'Gioca 30 partite in un solo giorno'),
('ach_daily_40', 'it', 'Giochi giornalieri: 40 partite', 'Gioca 40 partite in un solo giorno'),
('ach_daily_50', 'it', 'Giochi giornalieri: 50 partite', 'Gioca 50 partite in un solo giorno'),
('ach_daily_75', 'it', 'Giochi giornalieri: 75 partite', 'Gioca 75 partite in un solo giorno'),
('ach_daily_100', 'it', 'Giochi giornalieri: 100 partite', 'Gioca 100 partite in un solo giorno'),
('ach_daily_150', 'it', 'Giochi giornalieri: 150 partite', 'Gioca 150 partite in un solo giorno'),
('ach_daily_200', 'it', 'Giochi giornalieri: 200 partite', 'Gioca 200 partite in un solo giorno'),
('ach_daily_250', 'it', 'Giochi giornalieri: 250 partite', 'Gioca 250 partite in un solo giorno');

-- Portuguese (pt)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_daily_3', 'pt', 'Jogos diários: 3 jogos', 'Jogue 3 partidas em um único dia'),
('ach_daily_5', 'pt', 'Jogos diários: 5 jogos', 'Jogue 5 partidas em um único dia'),
('ach_daily_7', 'pt', 'Jogos diários: 7 jogos', 'Jogue 7 partidas em um único dia'),
('ach_daily_10', 'pt', 'Jogos diários: 10 jogos', 'Jogue 10 partidas em um único dia'),
('ach_daily_15', 'pt', 'Jogos diários: 15 jogos', 'Jogue 15 partidas em um único dia'),
('ach_daily_20', 'pt', 'Jogos diários: 20 jogos', 'Jogue 20 partidas em um único dia'),
('ach_daily_25', 'pt', 'Jogos diários: 25 jogos', 'Jogue 25 partidas em um único dia'),
('ach_daily_30', 'pt', 'Jogos diários: 30 jogos', 'Jogue 30 partidas em um único dia'),
('ach_daily_40', 'pt', 'Jogos diários: 40 jogos', 'Jogue 40 partidas em um único dia'),
('ach_daily_50', 'pt', 'Jogos diários: 50 jogos', 'Jogue 50 partidas em um único dia'),
('ach_daily_75', 'pt', 'Jogos diários: 75 jogos', 'Jogue 75 partidas em um único dia'),
('ach_daily_100', 'pt', 'Jogos diários: 100 jogos', 'Jogue 100 partidas em um único dia'),
('ach_daily_150', 'pt', 'Jogos diários: 150 jogos', 'Jogue 150 partidas em um único dia'),
('ach_daily_200', 'pt', 'Jogos diários: 200 jogos', 'Jogue 200 partidas em um único dia'),
('ach_daily_250', 'pt', 'Jogos diários: 250 jogos', 'Jogue 250 partidas em um único dia');

-- Danish (da)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_daily_3', 'da', 'Daglige spil: 3 spil', 'Spil 3 spil på en enkelt dag'),
('ach_daily_5', 'da', 'Daglige spil: 5 spil', 'Spil 5 spil på en enkelt dag'),
('ach_daily_7', 'da', 'Daglige spil: 7 spil', 'Spil 7 spil på en enkelt dag'),
('ach_daily_10', 'da', 'Daglige spil: 10 spil', 'Spil 10 spil på en enkelt dag'),
('ach_daily_15', 'da', 'Daglige spil: 15 spil', 'Spil 15 spil på en enkelt dag'),
('ach_daily_20', 'da', 'Daglige spil: 20 spil', 'Spil 20 spil på en enkelt dag'),
('ach_daily_25', 'da', 'Daglige spil: 25 spil', 'Spil 25 spil på en enkelt dag'),
('ach_daily_30', 'da', 'Daglige spil: 30 spil', 'Spil 30 spil på en enkelt dag'),
('ach_daily_40', 'da', 'Daglige spil: 40 spil', 'Spil 40 spil på en enkelt dag'),
('ach_daily_50', 'da', 'Daglige spil: 50 spil', 'Spil 50 spil på en enkelt dag'),
('ach_daily_75', 'da', 'Daglige spil: 75 spil', 'Spil 75 spil på en enkelt dag'),
('ach_daily_100', 'da', 'Daglige spil: 100 spil', 'Spil 100 spil på en enkelt dag'),
('ach_daily_150', 'da', 'Daglige spil: 150 spil', 'Spil 150 spil på en enkelt dag'),
('ach_daily_200', 'da', 'Daglige spil: 200 spil', 'Spil 200 spil på en enkelt dag'),
('ach_daily_250', 'da', 'Daglige spil: 250 spil', 'Spil 250 spil på en enkelt dag');

-- Dutch (nl)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_daily_3', 'nl', 'Dagelijkse spellen: 3 spellen', 'Speel 3 spellen op één dag'),
('ach_daily_5', 'nl', 'Dagelijkse spellen: 5 spellen', 'Speel 5 spellen op één dag'),
('ach_daily_7', 'nl', 'Dagelijkse spellen: 7 spellen', 'Speel 7 spellen op één dag'),
('ach_daily_10', 'nl', 'Dagelijkse spellen: 10 spellen', 'Speel 10 spellen op één dag'),
('ach_daily_15', 'nl', 'Dagelijkse spellen: 15 spellen', 'Speel 15 spellen op één dag'),
('ach_daily_20', 'nl', 'Dagelijkse spellen: 20 spellen', 'Speel 20 spellen op één dag'),
('ach_daily_25', 'nl', 'Dagelijkse spellen: 25 spellen', 'Speel 25 spellen op één dag'),
('ach_daily_30', 'nl', 'Dagelijkse spellen: 30 spellen', 'Speel 30 spellen op één dag'),
('ach_daily_40', 'nl', 'Dagelijkse spellen: 40 spellen', 'Speel 40 spellen op één dag'),
('ach_daily_50', 'nl', 'Dagelijkse spellen: 50 spellen', 'Speel 50 spellen op één dag'),
('ach_daily_75', 'nl', 'Dagelijkse spellen: 75 spellen', 'Speel 75 spellen op één dag'),
('ach_daily_100', 'nl', 'Dagelijkse spellen: 100 spellen', 'Speel 100 spellen op één dag'),
('ach_daily_150', 'nl', 'Dagelijkse spellen: 150 spellen', 'Speel 150 spellen op één dag'),
('ach_daily_200', 'nl', 'Dagelijkse spellen: 200 spellen', 'Speel 200 spellen op één dag'),
('ach_daily_250', 'nl', 'Dagelijkse spellen: 250 spellen', 'Speel 250 spellen op één dag');

-- Swedish (sv)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_daily_3', 'sv', 'Dagliga spel: 3 spel', 'Spela 3 spel under en enda dag'),
('ach_daily_5', 'sv', 'Dagliga spel: 5 spel', 'Spela 5 spel under en enda dag'),
('ach_daily_7', 'sv', 'Dagliga spel: 7 spel', 'Spela 7 spel under en enda dag'),
('ach_daily_10', 'sv', 'Dagliga spel: 10 spel', 'Spela 10 spel under en enda dag'),
('ach_daily_15', 'sv', 'Dagliga spel: 15 spel', 'Spela 15 spel under en enda dag'),
('ach_daily_20', 'sv', 'Dagliga spel: 20 spel', 'Spela 20 spel under en enda dag'),
('ach_daily_25', 'sv', 'Dagliga spel: 25 spel', 'Spela 25 spel under en enda dag'),
('ach_daily_30', 'sv', 'Dagliga spel: 30 spel', 'Spela 30 spel under en enda dag'),
('ach_daily_40', 'sv', 'Dagliga spel: 40 spel', 'Spela 40 spel under en enda dag'),
('ach_daily_50', 'sv', 'Dagliga spel: 50 spel', 'Spela 50 spel under en enda dag'),
('ach_daily_75', 'sv', 'Dagliga spel: 75 spel', 'Spela 75 spel under en enda dag'),
('ach_daily_100', 'sv', 'Dagliga spel: 100 spel', 'Spela 100 spel under en enda dag'),
('ach_daily_150', 'sv', 'Dagliga spel: 150 spel', 'Spela 150 spel under en enda dag'),
('ach_daily_200', 'sv', 'Dagliga spel: 200 spel', 'Spela 200 spel under en enda dag'),
('ach_daily_250', 'sv', 'Dagliga spel: 250 spel', 'Spela 250 spel under en enda dag');

-- Finnish (fi)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_daily_3', 'fi', 'Päivittäiset pelit: 3 peliä', 'Pelaa 3 peliä yhden päivän aikana'),
('ach_daily_5', 'fi', 'Päivittäiset pelit: 5 peliä', 'Pelaa 5 peliä yhden päivän aikana'),
('ach_daily_7', 'fi', 'Päivittäiset pelit: 7 peliä', 'Pelaa 7 peliä yhden päivän aikana'),
('ach_daily_10', 'fi', 'Päivittäiset pelit: 10 peliä', 'Pelaa 10 peliä yhden päivän aikana'),
('ach_daily_15', 'fi', 'Päivittäiset pelit: 15 peliä', 'Pelaa 15 peliä yhden päivän aikana'),
('ach_daily_20', 'fi', 'Päivittäiset pelit: 20 peliä', 'Pelaa 20 peliä yhden päivän aikana'),
('ach_daily_25', 'fi', 'Päivittäiset pelit: 25 peliä', 'Pelaa 25 peliä yhden päivän aikana'),
('ach_daily_30', 'fi', 'Päivittäiset pelit: 30 peliä', 'Pelaa 30 peliä yhden päivän aikana'),
('ach_daily_40', 'fi', 'Päivittäiset pelit: 40 peliä', 'Pelaa 40 peliä yhden päivän aikana'),
('ach_daily_50', 'fi', 'Päivittäiset pelit: 50 peliä', 'Pelaa 50 peliä yhden päivän aikana'),
('ach_daily_75', 'fi', 'Päivittäiset pelit: 75 peliä', 'Pelaa 75 peliä yhden päivän aikana'),
('ach_daily_100', 'fi', 'Päivittäiset pelit: 100 peliä', 'Pelaa 100 peliä yhden päivän aikana'),
('ach_daily_150', 'fi', 'Päivittäiset pelit: 150 peliä', 'Pelaa 150 peliä yhden päivän aikana'),
('ach_daily_200', 'fi', 'Päivittäiset pelit: 200 peliä', 'Pelaa 200 peliä yhden päivän aikana'),
('ach_daily_250', 'fi', 'Päivittäiset pelit: 250 peliä', 'Pelaa 250 peliä yhden päivän aikana');

-- =============================================
-- Genre Explorer Achievements
-- =============================================

-- German (de)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_genre_3', 'de', 'Musikentdecker: 3 Genres', 'Spiele Quiz in 3 verschiedenen Musikgenres'),
('ach_genre_5', 'de', 'Musikentdecker: 5 Genres', 'Spiele Quiz in 5 verschiedenen Musikgenres'),
('ach_genre_10', 'de', 'Genre-Abenteurer: 10 Genres', 'Spiele Quiz in 10 verschiedenen Musikgenres'),
('ach_genre_15', 'de', 'Genre-Abenteurer: 15 Genres', 'Spiele Quiz in 15 verschiedenen Musikgenres'),
('ach_genre_25', 'de', 'Genre-Meister: 25 Genres', 'Spiele Quiz in 25 verschiedenen Musikgenres');

-- English (en)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_genre_3', 'en', 'Music Explorer: 3 Genres', 'Play quizzes in 3 different music genres'),
('ach_genre_5', 'en', 'Music Explorer: 5 Genres', 'Play quizzes in 5 different music genres'),
('ach_genre_10', 'en', 'Genre Adventurer: 10 Genres', 'Play quizzes in 10 different music genres'),
('ach_genre_15', 'en', 'Genre Adventurer: 15 Genres', 'Play quizzes in 15 different music genres'),
('ach_genre_25', 'en', 'Genre Master: 25 Genres', 'Play quizzes in 25 different music genres');

-- French (fr)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_genre_3', 'fr', 'Explorateur musical: 3 genres', 'Jouez à des quiz dans 3 genres musicaux différents'),
('ach_genre_5', 'fr', 'Explorateur musical: 5 genres', 'Jouez à des quiz dans 5 genres musicaux différents'),
('ach_genre_10', 'fr', 'Aventurier des genres: 10 genres', 'Jouez à des quiz dans 10 genres musicaux différents'),
('ach_genre_15', 'fr', 'Aventurier des genres: 15 genres', 'Jouez à des quiz dans 15 genres musicaux différents'),
('ach_genre_25', 'fr', 'Maître des genres: 25 genres', 'Jouez à des quiz dans 25 genres musicaux différents');

-- Spanish (es)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_genre_3', 'es', 'Explorador musical: 3 géneros', 'Juega cuestionarios en 3 géneros musicales diferentes'),
('ach_genre_5', 'es', 'Explorador musical: 5 géneros', 'Juega cuestionarios en 5 géneros musicales diferentes'),
('ach_genre_10', 'es', 'Aventurero de géneros: 10 géneros', 'Juega cuestionarios en 10 géneros musicales diferentes'),
('ach_genre_15', 'es', 'Aventurero de géneros: 15 géneros', 'Juega cuestionarios en 15 géneros musicales diferentes'),
('ach_genre_25', 'es', 'Maestro de géneros: 25 géneros', 'Juega cuestionarios en 25 géneros musicales diferentes');

-- Italian (it)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_genre_3', 'it', 'Esploratore musicale: 3 generi', 'Gioca quiz in 3 diversi generi musicali'),
('ach_genre_5', 'it', 'Esploratore musicale: 5 generi', 'Gioca quiz in 5 diversi generi musicali'),
('ach_genre_10', 'it', 'Avventuriero dei generi: 10 generi', 'Gioca quiz in 10 diversi generi musicali'),
('ach_genre_15', 'it', 'Avventuriero dei generi: 15 generi', 'Gioca quiz in 15 diversi generi musicali'),
('ach_genre_25', 'it', 'Maestro dei generi: 25 generi', 'Gioca quiz in 25 diversi generi musicali');

-- Portuguese (pt)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_genre_3', 'pt', 'Explorador musical: 3 gêneros', 'Jogue questionários em 3 gêneros musicais diferentes'),
('ach_genre_5', 'pt', 'Explorador musical: 5 gêneros', 'Jogue questionários em 5 gêneros musicais diferentes'),
('ach_genre_10', 'pt', 'Aventureiro de gêneros: 10 gêneros', 'Jogue questionários em 10 gêneros musicais diferentes'),
('ach_genre_15', 'pt', 'Aventureiro de gêneros: 15 gêneros', 'Jogue questionários em 15 gêneros musicais diferentes'),
('ach_genre_25', 'pt', 'Mestre de gêneros: 25 gêneros', 'Jogue questionários em 25 gêneros musicais diferentes');

-- Danish (da)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_genre_3', 'da', 'Musikudforsker: 3 genrer', 'Spil quizzer i 3 forskellige musikgenrer'),
('ach_genre_5', 'da', 'Musikudforsker: 5 genrer', 'Spil quizzer i 5 forskellige musikgenrer'),
('ach_genre_10', 'da', 'Genre-eventyrer: 10 genrer', 'Spil quizzer i 10 forskellige musikgenrer'),
('ach_genre_15', 'da', 'Genre-eventyrer: 15 genrer', 'Spil quizzer i 15 forskellige musikgenrer'),
('ach_genre_25', 'da', 'Genre-mester: 25 genrer', 'Spil quizzer i 25 forskellige musikgenrer');

-- Dutch (nl)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_genre_3', 'nl', 'Muziekverkenner: 3 genres', 'Speel quizzen in 3 verschillende muziekgenres'),
('ach_genre_5', 'nl', 'Muziekverkenner: 5 genres', 'Speel quizzen in 5 verschillende muziekgenres'),
('ach_genre_10', 'nl', 'Genre-avonturier: 10 genres', 'Speel quizzen in 10 verschillende muziekgenres'),
('ach_genre_15', 'nl', 'Genre-avonturier: 15 genres', 'Speel quizzen in 15 verschillende muziekgenres'),
('ach_genre_25', 'nl', 'Genre-meester: 25 genres', 'Speel quizzen in 25 verschillende muziekgenres');

-- Swedish (sv)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_genre_3', 'sv', 'Musikutforskare: 3 genrer', 'Spela quiz i 3 olika musikgenrer'),
('ach_genre_5', 'sv', 'Musikutforskare: 5 genrer', 'Spela quiz i 5 olika musikgenrer'),
('ach_genre_10', 'sv', 'Genreäventyrare: 10 genrer', 'Spela quiz i 10 olika musikgenrer'),
('ach_genre_15', 'sv', 'Genreäventyrare: 15 genrer', 'Spela quiz i 15 olika musikgenrer'),
('ach_genre_25', 'sv', 'Genremästare: 25 genrer', 'Spela quiz i 25 olika musikgenrer');

-- Finnish (fi)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_genre_3', 'fi', 'Musiikkitutkija: 3 tyylilajia', 'Pelaa tietovisoja 3 eri musiikkityylilajissa'),
('ach_genre_5', 'fi', 'Musiikkitutkija: 5 tyylilajia', 'Pelaa tietovisoja 5 eri musiikkityylilajissa'),
('ach_genre_10', 'fi', 'Tyylilajiseikkailija: 10 tyylilajia', 'Pelaa tietovisoja 10 eri musiikkityylilajissa'),
('ach_genre_15', 'fi', 'Tyylilajiseikkailija: 15 tyylilajia', 'Pelaa tietovisoja 15 eri musiikkityylilajissa'),
('ach_genre_25', 'fi', 'Tyylilajimestari: 25 tyylilajia', 'Pelaa tietovisoja 25 eri musiikkityylilajissa');

-- =============================================
-- Game Series Achievements
-- =============================================

-- German (de)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_series_3', 'de', 'Spielserie: 3 Spiele', 'Spiele 3 Partien hintereinander, ohne zum Hauptmenü zurückzukehren'),
('ach_series_5', 'de', 'Spielserie: 5 Spiele', 'Spiele 5 Partien hintereinander, ohne zum Hauptmenü zurückzukehren'),
('ach_series_10', 'de', 'Spielserie: 10 Spiele', 'Spiele 10 Partien hintereinander, ohne zum Hauptmenü zurückzukehren');

-- English (en)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_series_3', 'en', 'Game Series: 3 Games', 'Play 3 games in a row without returning to the main menu'),
('ach_series_5', 'en', 'Game Series: 5 Games', 'Play 5 games in a row without returning to the main menu'),
('ach_series_10', 'en', 'Game Series: 10 Games', 'Play 10 games in a row without returning to the main menu');

-- French (fr)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_series_3', 'fr', 'Série de jeux: 3 parties', 'Jouez à 3 parties d''affilée sans revenir au menu principal'),
('ach_series_5', 'fr', 'Série de jeux: 5 parties', 'Jouez à 5 parties d''affilée sans revenir au menu principal'),
('ach_series_10', 'fr', 'Série de jeux: 10 parties', 'Jouez à 10 parties d''affilée sans revenir au menu principal');

-- Spanish (es)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_series_3', 'es', 'Serie de juegos: 3 juegos', 'Juega 3 partidas seguidas sin volver al menú principal'),
('ach_series_5', 'es', 'Serie de juegos: 5 juegos', 'Juega 5 partidas seguidas sin volver al menú principal'),
('ach_series_10', 'es', 'Serie de juegos: 10 juegos', 'Juega 10 partidas seguidas sin volver al menú principal');

-- Italian (it)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_series_3', 'it', 'Serie di giochi: 3 partite', 'Gioca 3 partite di seguito senza tornare al menu principale'),
('ach_series_5', 'it', 'Serie di giochi: 5 partite', 'Gioca 5 partite di seguito senza tornare al menu principale'),
('ach_series_10', 'it', 'Serie di giochi: 10 partite', 'Gioca 10 partite di seguito senza tornare al menu principale');

-- Portuguese (pt)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_series_3', 'pt', 'Série de jogos: 3 jogos', 'Jogue 3 partidas seguidas sem voltar ao menu principal'),
('ach_series_5', 'pt', 'Série de jogos: 5 jogos', 'Jogue 5 partidas seguidas sem voltar ao menu principal'),
('ach_series_10', 'pt', 'Série de jogos: 10 jogos', 'Jogue 10 partidas seguidas sem voltar ao menu principal');

-- Danish (da)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_series_3', 'da', 'Spilserie: 3 spil', 'Spil 3 spil i træk uden at vende tilbage til hovedmenuen'),
('ach_series_5', 'da', 'Spilserie: 5 spil', 'Spil 5 spil i træk uden at vende tilbage til hovedmenuen'),
('ach_series_10', 'da', 'Spilserie: 10 spil', 'Spil 10 spil i træk uden at vende tilbage til hovedmenuen');

-- Dutch (nl)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_series_3', 'nl', 'Spelserie: 3 spellen', 'Speel 3 spellen achter elkaar zonder terug te keren naar het hoofdmenu'),
('ach_series_5', 'nl', 'Spelserie: 5 spellen', 'Speel 5 spellen achter elkaar zonder terug te keren naar het hoofdmenu'),
('ach_series_10', 'nl', 'Spelserie: 10 spellen', 'Speel 10 spellen achter elkaar zonder terug te keren naar het hoofdmenu');

-- Swedish (sv)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_series_3', 'sv', 'Spelserie: 3 spel', 'Spela 3 spel i rad utan att återvända till huvudmenyn'),
('ach_series_5', 'sv', 'Spelserie: 5 spel', 'Spela 5 spel i rad utan att återvända till huvudmenyn'),
('ach_series_10', 'sv', 'Spelserie: 10 spel', 'Spela 10 spel i rad utan att återvända till huvudmenyn');

-- Finnish (fi)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_series_3', 'fi', 'Pelisarja: 3 peliä', 'Pelaa 3 peliä peräkkäin palaamatta päävalikkoon'),
('ach_series_5', 'fi', 'Pelisarja: 5 peliä', 'Pelaa 5 peliä peräkkäin palaamatta päävalikkoon'),
('ach_series_10', 'fi', 'Pelisarja: 10 peliä', 'Pelaa 10 peliä peräkkäin palaamatta päävalikkoon');

-- =============================================
-- Quick Answer Achievements
-- =============================================

-- German (de)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_speed_5', 'de', 'Schnelldenker: 5 Schnelle Antworten', 'Beantworte 5 Fragen richtig in weniger als 3 Sekunden'),
('ach_speed_15', 'de', 'Blitzantwort: 15 Schnelle Antworten', 'Beantworte 15 Fragen richtig in weniger als 3 Sekunden');

-- English (en)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_speed_5', 'en', 'Quick Thinker: 5 Quick Answers', 'Answer 5 questions correctly in less than 3 seconds'),
('ach_speed_15', 'en', 'Lightning Response: 15 Quick Answers', 'Answer 15 questions correctly in less than 3 seconds');

-- French (fr)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_speed_5', 'fr', 'Penseur Rapide: 5 Réponses Rapides', 'Répondez correctement à 5 questions en moins de 3 secondes'),
('ach_speed_15', 'fr', 'Réponse Éclair: 15 Réponses Rapides', 'Répondez correctement à 15 questions en moins de 3 secondes');

-- Spanish (es)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_speed_5', 'es', 'Pensador Rápido: 5 Respuestas Rápidas', 'Responde correctamente a 5 preguntas en menos de 3 segundos'),
('ach_speed_15', 'es', 'Respuesta Relámpago: 15 Respuestas Rápidas', 'Responde correctamente a 15 preguntas en menos de 3 segundos');

-- Italian (it)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_speed_5', 'it', 'Pensatore Veloce: 5 Risposte Rapide', 'Rispondi correttamente a 5 domande in meno di 3 secondi'),
('ach_speed_15', 'it', 'Risposta Fulminea: 15 Risposte Rapide', 'Rispondi correttamente a 15 domande in meno di 3 secondi');

-- Portuguese (pt)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_speed_5', 'pt', 'Pensador Rápido: 5 Respostas Rápidas', 'Responda corretamente a 5 perguntas em menos de 3 segundos'),
('ach_speed_15', 'pt', 'Resposta Relâmpago: 15 Respostas Rápidas', 'Responda corretamente a 15 perguntas em menos de 3 segundos');

-- Danish (da)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_speed_5', 'da', 'Hurtig Tænker: 5 Hurtige Svar', 'Svar korrekt på 5 spørgsmål på mindre end 3 sekunder'),
('ach_speed_15', 'da', 'Lynhurtig Respons: 15 Hurtige Svar', 'Svar korrekt på 15 spørgsmål på mindre end 3 sekunder');

-- Dutch (nl)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_speed_5', 'nl', 'Snelle Denker: 5 Snelle Antwoorden', 'Beantwoord 5 vragen correct in minder dan 3 seconden'),
('ach_speed_15', 'nl', 'Bliksemsnelle Reactie: 15 Snelle Antwoorden', 'Beantwoord 15 vragen correct in minder dan 3 seconden');

-- Swedish (sv)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_speed_5', 'sv', 'Snabbtänkare: 5 Snabba Svar', 'Svara rätt på 5 frågor på mindre än 3 sekunder'),
('ach_speed_15', 'sv', 'Blixtsnabb Respons: 15 Snabba Svar', 'Svara rätt på 15 frågor på mindre än 3 sekunder');

-- Finnish (fi)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_speed_5', 'fi', 'Nopea Ajattelija: 5 Nopeaa Vastausta', 'Vastaa oikein 5 kysymykseen alle 3 sekunnissa'),
('ach_speed_15', 'fi', 'Salamannopea Vastaus: 15 Nopeaa Vastausta', 'Vastaa oikein 15 kysymykseen alle 3 sekunnissa');

-- =============================================
-- Seasonal Event Achievements
-- =============================================

-- German (de)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_seasonal_1', 'de', 'Saisonspieler', 'Nimm an einem saisonalen Musikevent teil'),
('ach_seasonal_3', 'de', 'Saisonbegeisterter', 'Nimm an 3 verschiedenen saisonalen Musikevents teil');

-- English (en)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_seasonal_1', 'en', 'Seasonal Player', 'Participate in one seasonal music event'),
('ach_seasonal_3', 'en', 'Season Enthusiast', 'Participate in 3 different seasonal music events');

-- French (fr)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_seasonal_1', 'fr', 'Joueur Saisonnier', 'Participez à un événement musical saisonnier'),
('ach_seasonal_3', 'fr', 'Enthousiaste des Saisons', 'Participez à 3 événements musicaux saisonniers différents');

-- Spanish (es)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_seasonal_1', 'es', 'Jugador Estacional', 'Participa en un evento musical estacional'),
('ach_seasonal_3', 'es', 'Entusiasta de Temporada', 'Participa en 3 eventos musicales estacionales diferentes');

-- Italian (it)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_seasonal_1', 'it', 'Giocatore Stagionale', 'Partecipa a un evento musicale stagionale'),
('ach_seasonal_3', 'it', 'Entusiasta delle Stagioni', 'Partecipa a 3 diversi eventi musicali stagionali');

-- Portuguese (pt)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_seasonal_1', 'pt', 'Jogador Sazonal', 'Participe em um evento musical sazonal'),
('ach_seasonal_3', 'pt', 'Entusiasta das Estações', 'Participe em 3 eventos musicais sazonais diferentes');

-- Danish (da)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_seasonal_1', 'da', 'Sæsonspiller', 'Deltag i en sæsonbestemt musikbegivenhed'),
('ach_seasonal_3', 'da', 'Sæsonentusiast', 'Deltag i 3 forskellige sæsonbestemte musikbegivenheder');

-- Dutch (nl)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_seasonal_1', 'nl', 'Seizoensspeler', 'Neem deel aan een seizoensgebonden muziekevenement'),
('ach_seasonal_3', 'nl', 'Seizoensenthousiast', 'Neem deel aan 3 verschillende seizoensgebonden muziekevenementen');

-- Swedish (sv)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_seasonal_1', 'sv', 'Säsongsspelare', 'Delta i ett säsongsbetonat musikevenemang'),
('ach_seasonal_3', 'sv', 'Säsongsentusiast', 'Delta i 3 olika säsongsbetonade musikevenemang');

-- Finnish (fi)
INSERT INTO achievement_translations (achievement_id, language, name, description) VALUES
('ach_seasonal_1', 'fi', 'Kausipelaaja', 'Osallistu yhteen kausittaiseen musiikkitapahtumaan'),
('ach_seasonal_3', 'fi', 'Kausiharrastaja', 'Osallistu 3 eri kausittaiseen musiikkitapahtumaan');