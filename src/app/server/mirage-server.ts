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
          {firstName: 'ad', lastName: 'jz', email: 'ad@jz.com', password: 'adjz'},
        ],
        parties_jouees: [
          {email: 'adrian@jimenez.com', totalParties: 25},
          {email: 'ad@jz.com', totalParties: 18},
        ],
        taux_reussite: [
          {email: 'adrian@jimenez.com', bonnesReponses: 85, totalReponses: 100},
          {email: 'ad@jz.com', bonnesReponses: 72, totalReponses: 90},
        ],
        evolution_scores: [
          {partieId: 1, email: 'adrian@jimenez.com', score: 80, datePartie: '2025-01-01'},
          {partieId: 2, email: 'adrian@jimenez.com', score: 95, datePartie: '2025-01-02'},
          {partieId: 3, email: 'ad@jz.com', score: 70, datePartie: '2025-01-03'},
        ],
        temps_reponse: [
          {email: 'adrian@jimenez.com', tempsMoyenMs: 1750}, // Moyenne des temps : (1500 + 2000) / 2
          {email: 'ad@jz.com', tempsMoyenMs: 1800},          // Moyenne d'un seul temps : 1800
        ],
        leaderboard: [],
        achievements: [],
      });
    },
    routes() {
      this.namespace = 'api'; // Définit "api" comme préfixe pour toutes les routes

      // Endpoint pour l'inscription
      this.post('/signup', (schema, request) => {
        const userData = JSON.parse(request.requestBody);

        // Vérifiez si l'utilisateur existe déjà
        const existingUser = schema.db['users'].findBy({email: userData.email});
        if (existingUser) {
          return new Response(400, {}, {error: 'Cet email est déjà utilisé.'});
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
          achievements: [], // faire une db associé aux badges, tel badge = tel image avec son nom associé
        }

        // Ajout de l'utilisateur à la base simulée
        schema.db['users'].insert(userData);
        schema.db['parties_jouees'].insert({email: userData.email, totalParties: 0});
        schema.db['taux_reussite'].insert({email: userData.email, bonnesReponses: 0, totalReponses: 0});
        schema.db['evolution_scores'].insert({partieId: 0, email: userData.email, score: 0, datePartie: ''});
        schema.db['temps_reponse'].insert({email: userData.email, tempsMoyenMs: 0});
        schema.db['leaderboard'].insert(defaultLeaderboardData);
        schema.db['achievements'].insert(defaultAchievementsData);
        return {message: 'Inscription réussie', user: userData};
      });

      // Endpoint pour la connexion
      this.post('/login', (schema, request) => {
        const {email, password} = JSON.parse(request.requestBody);

        // Vérifiez si l'utilisateur existe dans la base
        const user = schema.db['users'].findBy({email, password});
        if (user) {
          return {message: 'Connexion réussie', token: 'fake-jwt-token'};
        }

        return new Response(401, {}, {error: 'Identifiants invalides. Veuillez vous inscrire.'});
      });

      // Route pour récupérer le nombre de parties jouées
      this.get("/parties_jouees", (schema) => {
        return schema.db['parties_jouees'];
      });

      // Route pour récupérer le taux de réussite
      this.get("/taux_reussite", (schema) => {
        return schema.db['taux_reussite'];
      });

      // Route pour récupérer l'évolution des scores
      this.get("/evolution_scores", (schema) => {
        return schema.db['evolution_scores'];
      });

      // Route pour récupérer le temps moyen de réponse
      this.get("/temps_reponse", (schema) => {
        return schema.db['temps_reponse'];
      });
    },
    
  });
}
