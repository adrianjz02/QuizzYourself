import {createServer, Model, Response} from 'miragejs';

export function makeServer() {
  createServer({
    models: {
      users: Model,
      leaderboard: Model,
      achievement: Model,
    },
    seeds(server) {
      // Ajouter un utilisateur par défaut pour la connexion
      server.db.loadData({
        users: [
          {firstName: 'Adrian', lastName: 'Jimenez', email: 'adrian@jimenez.com', password: 'adrianjimenez'},
        ],
      });
    },
    routes() {
      this.namespace = 'api'; // Définit "api" comme préfixe pour toutes les routes

      // Endpoint pour l'inscription
      this.post('/signup', (schema, request) => {
        const userData = JSON.parse(request.requestBody);

        // Vérifiez si l'utilisateur existe déjà
        const existingUser = schema.db['users'].findBy({ email: userData.email });
        if (existingUser) {
          return new Response(400, {}, { error: 'Cet email est déjà utilisé.' });
        }

        // Ajout des données par défaut pour le leaderboard et les achievements
        const defaultLeaderboardData = {
          userId: userData.email, // Utilisez un identifiant unique pour associer les données
          totalScore: 0,
          rank: null,
          playTime: 0,
          victories: 0,
        };

        const defaultAchievementsData = {
          userId: userData.email, // Utilisez un identifiant unique pour associer les données
          achievements: [],
        }

        // Ajout de l'utilisateur à la base simulée
        schema.db['users'].insert(userData);
        schema.db['leaderboard'].insert(defaultLeaderboardData);
        schema.db['achievements'].insert(defaultAchievementsData);
        return { message: 'Inscription réussie', user: userData };
      });

      // Endpoint pour la connexion
      this.post('/login', (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);

        // Vérifiez si l'utilisateur existe dans la base
        const user = schema.db['users'].findBy({ email, password });
        if (user) {
          return { message: 'Connexion réussie', token: 'fake-jwt-token' };
        }

        return new Response(401, {}, { error: 'Identifiants invalides. Veuillez vous inscrire.' });
      });

    },
  });
}
