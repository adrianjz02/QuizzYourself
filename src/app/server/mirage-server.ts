import {createServer, Model, Response} from 'miragejs';

export function makeServer() {
  createServer({
    models: {
      users: Model,
      parties_jouees: Model,
      taux_reussite: Model,
      evolution_scores: Model,
      temps_reponse: Model,
      leaderboard: Model,
      achievement: Model,
      quizzes: Model,
      quizAttempts: Model
    },
    seeds(server) {
      // Ajouter un utilisateur par défaut pour la connexion
      server.db.loadData({
        users: [
          {firstName: 'Adrian', lastName: 'Jimenez', email: 'ad@jz.com', password: 'adjz'},
          {firstName: 'ad', lastName: 'jz', email: 'ad@jz.com', password: 'adjz'},
          {firstName: 'ay', lastName: 'ca', email: 'ay@ca.com', password: 'ayca'},
        ],
        parties_jouees: [
          {email: 'ad@jz.com', totalParties: 100},
          {email: 'ay@ca.com', totalParties: 50},
          {email: 'ma@gu.com', totalParties: 25},
        ],
        taux_reussite: [
          {email: 'ad@jz.com', bonnesReponses: 85, totalReponses: 100},
          {email: 'ay@ca.com', bonnesReponses: 72, totalReponses: 90},
        ],
        evolution_scores: [
          {partieId: 1, email: 'ad@jz.com', score: 80, datePartie: '2025-01-01', tempsMoyenReponse: 1750},
          {partieId: 2, email: 'ad@jz.com', score: 95, datePartie: '2025-01-02', tempsMoyenReponse: 1850},
          {partieId: 3, email: 'ad@jz.com', score: 70, datePartie: '2025-01-03', tempsMoyenReponse: 1850},
        ],
        temps_reponse: [
          {email: 'ad@jz.com', tempsMoyenMs: 1750},
          {email: 'ay@ca.com', tempsMoyenMs: 1800},
        ],
        leaderboard: [],
        achievements: [],
        quizzes: [
          {
            id: 1,
            videoUrl: "https://www.youtube.com/watch?v=4MK89zVlYdQ",  // Remove &ab_channel=FailArmy
            category: "Action",
            pauseTimeInSeconds: 7,
            options: [
              "The character jumps off the cliff",
              "The character fights the boss",
              "The character finds a secret door",
              "The character dies"
            ],
            correctAnswer: "The character fights the boss",
            timeLimit: 25
          }/*,
          {
            id: 2,
            videoUrl: "https://www.youtube.com/shorts/64xjmKWVo0c",
            category: "Sport",
            pauseTimeInSeconds: 2,
            options: [
              "The guy send his ball in a tree",
              "The guy destroys his little hoop",
              "The guy scores a basket in another hoop",
              "The guy makes the ball disappear"
            ],
            correctAnswer: "The guy scores a basket in another hoop",
            timeLimit: 20
          }*/,
          {
            id: 2,
            videoUrl: "https://www.youtube.com/watch?v=qvC2bVa7UX4&ab_channel=squewe",
            category: "Animals",
            pauseTimeInSeconds: 40,
            options: [
              "RAT1",
              "RAT2",
              "RAT3",
              "RAT4"
            ],
            correctAnswer: "RAT2",
            timeLimit: 59
          }
        ],
        quizAttempts: []
      });
    },
    routes() {
      this.namespace = 'api';

      // Endpoint pour l'inscription
      this.post('/signup', (schema, request) => {
        const userData = JSON.parse(request.requestBody);

        const existingUser = schema.db['users'].findBy({email: userData.email});
        if (existingUser) {
          return new Response(400, {}, {error: 'Cet email est déjà utilisé.'});
        }

        const defaultLeaderboardData = {
          userId: userData.email,
          totalScore: 0,
          rank: null,
          playTime: 0,
          victories: 0,
        };

        const defaultAchievementsData = {
          userId: userData.email,
          achievements: [],
        }

        schema.db['users'].insert(userData);
        schema.db['parties_jouees'].insert({email: userData.email, totalParties: 0});
        schema.db['taux_reussite'].insert({email: userData.email, bonnesReponses: 0, totalReponses: 0});
        schema.db['evolution_scores'].insert({partieId: 0, email: userData.email, score: 0, datePartie: ''});
        schema.db['temps_reponse'].insert({email: userData.email, tempsMoyenMs: 0});
        schema.db['leaderboard'].insert(defaultLeaderboardData);
        schema.db['achievements'].insert(defaultAchievementsData);
        schema.db['quizAttempts'].insert({
          email: userData.email,
          attempts: []
        });

        return {message: 'Inscription réussie', user: userData};
      });

      // Existing routes...
      this.post('/login', (schema, request) => {
        const {email, password} = JSON.parse(request.requestBody);
        const user = schema.db['users'].findBy({email, password});
        if (user) {
          return {message: 'Connexion réussie', token: 'fake-jwt-token'};
        }
        return new Response(401, {}, {error: 'Identifiants invalides. Veuillez vous inscrire.'});
      });

      this.get("/parties_jouees", (schema, request) => {
        const email = request.queryParams['email'];
        if (email) {
          const userParties = schema.db['parties_jouees'].findBy({email});
          if (userParties) {
            return userParties;
          }
        }
        return new Response(404, {}, {error: "Utilisateur non trouvé"});
      });

      this.get("/taux_reussite", (schema, request) => {
        const email = request.queryParams['email'];
        if (email) {
          return schema.db['taux_reussite'].findBy({email});
        }
        return new Response(404, {}, {error: "Utilisateur non trouvé"});
      });

      this.get("/evolution_scores", (schema, request) => {
        const email = request.queryParams['email'];
        if (email) {
          return schema.db['evolution_scores'].filter((score) => score.email === email);
        }
        return new Response(404, {}, {error: "Utilisateur non trouvé"});
      });

      this.get("/temps_reponse", (schema, request) => {
        const email = request.queryParams['email'];
        if (email) {
          return schema.db['temps_reponse'].findBy({email});
        }
        return new Response(404, {}, {error: "Utilisateur non trouvé"});
      });

      // Route pour récupérer la moyenne des temps de réponse
      this.get("/temps_reponse/moyenne", (schema) => {
        const temps = schema.db['temps_reponse'];
        if (temps.length === 0) return {moyenne: 0};

        // Calcul de la moyenne des tempsMoyenMs
        const totalTemps = temps.reduce((sum, item) => sum + item.tempsMoyenMs, 0);
        const moyenne = totalTemps / temps.length;

        return {moyenne};
      });

      // Méthode pour obtenir le maximum de parties jouées
      this.get("/max_parties", (schema) => {
        const parties = schema.db['parties_jouees'];
        if (parties && parties.length > 0) {
          const maxParties = parties.reduce((max, current) =>
            current.totalParties > max ? current.totalParties : max, 0);
          return {maxParties};
        }
        return {maxParties: 0};
      });

      this.get("/average_parties", (schema) => {
        const parties = schema.db['parties_jouees'];
        if (parties && parties.length > 0) {
          const total = parties.reduce((sum, current) => sum + current.totalParties, 0);
          const average = total / parties.length;
          return {averageParties: average};
        }
        return {averageParties: 0};
      });

      // New quiz routes
      this.get("/quizzes", (schema, request) => {
        const category = request.queryParams['category'];
        if (category) {
          return schema.db['quizzes'].filter(quiz => quiz.category === category);
        }
        console.log('Serving quizzes:', schema.db['quizzes']);
        return schema.db['quizzes'];
      });

      this.get("/quiz/:id", (schema, request) => {
        const quiz = schema.db['quizzes'].find(request.params['id']);
        if (quiz) {
          return quiz;
        }
        return new Response(404, {}, {error: "Quiz non trouvé"});
      });

      this.post("/quiz-attempts", (schema, request) => {
        const attemptData = JSON.parse(request.requestBody);
        const {quizId, email, selectedAnswer, timeToAnswer} = attemptData;

        const quiz = schema.db['quizzes'].find(quizId);
        if (!quiz) {
          return new Response(404, {}, {error: "Quiz non trouvé"});
        }

        const isCorrect = quiz.options[selectedAnswer] === quiz.correctAnswer;

        // Update user statistics
        const userStats = schema.db['taux_reussite'].findBy({email});
        if (userStats) {
          const updatedStats = {
            ...userStats,
            totalReponses: userStats.totalReponses + 1,
            bonnesReponses: userStats.bonnesReponses + (isCorrect ? 1 : 0)
          };
          schema.db['taux_reussite'].update({email}, updatedStats);
        }

        // Update temps_reponse
        const tempsReponse = schema.db['temps_reponse'].findBy({email});
        if (tempsReponse) {
          const oldTotal = tempsReponse.tempsMoyenMs * userStats.totalReponses;
          const newAverage = (oldTotal + timeToAnswer) / (userStats.totalReponses + 1);
          schema.db['temps_reponse'].update({email}, {
            ...tempsReponse,
            tempsMoyenMs: newAverage
          });
        }

        // Add new attempt
        const userAttempts = schema.db['quizAttempts'].findBy({email});
        if (userAttempts) {
          schema.db['quizAttempts'].update({email}, {
            ...userAttempts,
            attempts: [...userAttempts.attempts, {
              quizId,
              selectedAnswer,
              timeToAnswer,
              isCorrect,
              timestamp: new Date().toISOString()
            }]
          });
        }

        return {
          isCorrect,
          correctAnswer: quiz.correctAnswer
        };
      });

      this.get("/quiz-stats", (schema, request) => {
        const email = request.queryParams['email'];
        if (!email) {
          return new Response(400, {}, {error: "Email requis"});
        }

        const userAttempts = schema.db['quizAttempts'].findBy({email});
        if (!userAttempts || userAttempts.attempts.length === 0) {
          return {
            totalAttempts: 0,
            correctAnswers: 0,
            averageTimeToAnswer: 0,
            successRate: 0
          };
        }

        const attempts = userAttempts.attempts;
        const totalAttempts = attempts.length;
        const correctAnswers = attempts.filter((a: { isCorrect: any; }) => a.isCorrect).length;
        const averageTimeToAnswer = attempts.reduce((acc: any, curr: { timeToAnswer: any; }) => acc + curr.timeToAnswer, 0) / totalAttempts;
        const successRate = (correctAnswers / totalAttempts) * 100;

        return {
          totalAttempts,
          correctAnswers,
          averageTimeToAnswer,
          successRate
        };
      });
    },
  });
}
