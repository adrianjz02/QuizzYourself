import {createServer, Model, Response} from 'miragejs';


export function makeServer() {

  // Try to retrieve persisted data from localStorage
  const persistedData = localStorage.getItem('mirageData');
  const initialData = persistedData ? JSON.parse(persistedData) : null;

  let server = createServer({
    models: {
      users: Model,
      parties_jouees: Model,
      taux_reussite: Model,
      evolution_scores: Model,
      temps_reponse: Model,
      totalScore: Model,
      quizzes: Model,
      quizAttempts: Model
    },
    seeds(server) {
      if (initialData) {
        // Load persisted data if it exists
        server.db.loadData(initialData);
      } else {
        // Ajouter un utilisateur par défaut pour la connexion
        server.db.loadData({
          users: [
            {
              firstName: 'Adrian',
              lastName: 'Jimenez',
              email: 'ad@jz.com',
              pseudonyme: 'adrianjimenez',
              password: 'adjz',
              avatar: 'avatar1.png'
            },
            {
              firstName: 'ad',
              lastName: 'jz',
              email: 'ad@jz.com',
              pseudonyme: 'adjz',
              password: 'adjz',
              avatar: 'avatar1.png'
            },
            {
              firstName: 'ay',
              lastName: 'ca',
              email: 'ay@ca.com',
              pseudonyme: 'ayca',
              password: 'ayca',
              avatar: 'avatar2.png'
            },
          ],
          parties_jouees: [
            {email: 'ad@jz.com', totalParties: 3},
            {email: 'ay@ca.com', totalParties: 3},
            {email: 'ma@gu.com', totalParties: 0},
          ],
          taux_reussite: [
            {email: 'ad@jz.com', bonnesReponses: 85, totalReponses: 100},
            {email: 'ay@ca.com', bonnesReponses: 72, totalReponses: 90},
          ],
          evolution_scores: [
            {partieId: 1, email: 'ad@jz.com', score: 0, datePartie: '2025-01-01', tempsMoyenReponse: 1750},
            {partieId: 2, email: 'ad@jz.com', score: 0, datePartie: '2025-01-02', tempsMoyenReponse: 1850},
            {partieId: 3, email: 'ad@jz.com', score: 10, datePartie: '2025-01-03', tempsMoyenReponse: 1850},
            {partieId: 4, email: 'ay@ca.com', score: 0, datePartie: '2025-01-01', tempsMoyenReponse: 1750},
            {partieId: 5, email: 'ay@ca.com', score: 0, datePartie: '2025-01-02', tempsMoyenReponse: 1850},
            {partieId: 6, email: 'ay@ca.com', score: 0, datePartie: '2025-01-03', tempsMoyenReponse: 1850},
          ],
          totalScore: [],
          temps_reponse: [
            {email: 'ad@jz.com', tempsMoyenMs: 1750},
            {email: 'ay@ca.com', tempsMoyenMs: 1800},
          ],
          quizzes: [
            {
              id: 1,
              videoUrl: "https://www.youtube.com/watch?v=4MK89zVlYdQ",  // Remove &ab_channel=FailArmy
              category: "Action",
              pauseTimeInSeconds: 7,
              options: [
                "The character jumps off the cliffAAAAAAAAA",
                "The character fights the boss",
                "The character finds a secret door",
                "The character dies"
              ],
              correctAnswer: "The character fights the boss",
              timeLimit: 15
            }/*,
            {
              id: 3,
              videoUrl: "https://www.youtube.com/watch?v=rPAxrIrw1oU",
              category: "Sport",
              pauseTimeInSeconds: 14,
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
              timeLimit: 15
            },
            {
              id: 4,
              videoUrl: "https://www.youtube.com/shorts/5Ko9BQ6p7XA",  // Remove &ab_channel=FailArmy
              category: "Sport",
              pauseTimeInSeconds: 5,
              options: [
                "The character jumps off the cliffAAAAAAAAA",
                "The character fights the boss",
                "The character finds a secret door",
                "The character dies"
              ],
              correctAnswer: "The character fights the boss",
              timeLimit: 15
            }
          ],
          quizAttempts: []
        });
      }
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
        schema.db['quizAttempts'].insert({
          email: userData.email,
          attempts: []
        });

        return {message: 'Inscription réussie', user: userData};
      });

      this.post("/update-game", (schema, request) => {
        // On récupère les informations de la partie dans le body de la requête
        const {
          email,
          score,
          datePartie,
          tempsMoyenReponse,
          bonnesReponses,  // nombre de réponses correctes obtenues lors de la partie
          totalReponses    // nombre total de réponses lors de la partie
        } = JSON.parse(request.requestBody);

        // 1. Mise à jour du nombre de parties jouées dans la table parties_jouees
        let userParties = schema.db["parties_jouees"].findBy({email});
        if (userParties) {
          // Incrémentation du total de parties
          const updatedParties = userParties.totalParties + 1;
          schema.db["parties_jouees"].update({email}, {...userParties, totalParties: updatedParties});
        } else {
          // Si l'utilisateur n'existe pas dans parties_jouees, on l'ajoute avec 1 partie jouée
          schema.db["parties_jouees"].insert({email, totalParties: 1});
        }

        // 2. Enregistrement de la partie dans evolution_scores
        // Sinon, on calcule un nouvel identifiant pour la partie (on ajoute 1 au max existant)
        let newPartieId = 1;
        if (schema.db["evolution_scores"].length > 0) {
          newPartieId = Math.max(...schema.db["evolution_scores"].map(s => s.partieId)) + 1;
        }
        schema.db["evolution_scores"].insert({
          partieId: newPartieId,
          email,
          score,
          datePartie,
          tempsMoyenReponse
        });

        // 3. Mise à jour du taux de réussite dans taux_reussite
        let userTaux = schema.db["taux_reussite"].findBy({email});
        if (userTaux) {
          const updatedBonnesReponses = userTaux.bonnesReponses + bonnesReponses;
          const updatedTotalReponses = userTaux.totalReponses + totalReponses;
          schema.db["taux_reussite"].update({email}, {
            ...userTaux,
            bonnesReponses: updatedBonnesReponses,
            totalReponses: updatedTotalReponses
          });
        } else {
          // Si l'utilisateur n'existe pas dans taux_reussite, on l'initialise avec les valeurs de la partie
          schema.db["taux_reussite"].insert({email, bonnesReponses, totalReponses});
        }

        return {message: "Partie mise à jour avec succès"};
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

      this.get("/profile/:email", (schema, request) => {
        let email = request.params['email'];

        // Récupérer les données de l'utilisateur
        let user = schema.db['users'].findBy({email});
        let partiesJouees = schema.db['parties_jouees'].findBy({email});
        let tauxReussite = schema.db['taux_reussite'].findBy({email});
        let totalScore = schema.db['totalScore'].findBy({email});
        let tempsReponse = schema.db['temps_reponse'].findBy({email});
        let evolutionScores = schema.db['evolution_scores'].filter(score => score.email === email);

        if (!user) {
          return new Response(404, {}, {error: "Utilisateur non trouvé"});
        }

        return {
          user,
          partiesJouees: partiesJouees || {totalParties: 0},
          tauxReussite: tauxReussite || {bonnesReponses: 0, totalReponses: 0},
          totalScore: totalScore || {totalScore: 0},
          tempsReponse: tempsReponse || {tempsMoyenMs: 0},
          evolutionScores
        };
      });


      this.get('/get-user/:email', (schema, request) => {
        let email = request.params['email'];

        // Recherche de l'utilisateur avec l'email donné
        let user = schema.db['users'].findBy({email});

        if (user) {
          return {pseudonyme: user.pseudonyme};
        } else {
          return new Response(404, {}, {error: "Utilisateur non trouvé"});
        }
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

      // 🚀 Requête Mirage pour initialiser totalScore dynamiquement
      this.post('/init-total-score', (schema) => {
        let scores = schema.db['evolution_scores'] as { email: string; score: number }[];

        let totalScores: Record<string, number> = scores.reduce((acc, {email, score}) => {
          acc[email] = (acc[email] || 0) + score; // Addition des scores par email
          return acc;
        }, {} as Record<string, number>);

        let totalScoreArray = Object.entries(totalScores).map(([email, totalScore]) => ({email, totalScore}));

        schema.db['totalScore'].remove();
        schema.db['totalScore'].insert(totalScoreArray);

        return {message: 'Table totalScore mise à jour avec succès', totalScore: totalScoreArray};
      });


      // Définition de la route GET qui prend un email en paramètre
      this.get("/tempsMoyen/:email", (schema, request) => {
        const email = request.params['email'];

        // Récupération des enregistrements dans la table evolution_scores pour l'email spécifié
        const scores = schema.db["evolution_scores"].filter(score => score.email === email);

        if (!scores || scores.length === 0) {
          return {error: `Aucun score trouvé pour l'email: ${email}`};
        }

        // Calcul de la somme des temps de réponse
        const totalTemps = scores.reduce((total, score) => total + score.tempsMoyenReponse, 0);
        // Calcul de la moyenne
        const moyenneTempsReponse = totalTemps / scores.length;

        return {email, moyenneTempsReponse};
      });

      this.get("/tempsMoyenGlobal", (schema) => {
        // Récupération de tous les enregistrements de la table evolution_scores
        const scores = schema.db["evolution_scores"];

        if (!scores || scores.length === 0) {
          return {error: "Aucun score disponible"};
        }

        // Calcul de la somme des temps de réponse
        const totalTemps = scores.reduce((acc, item) => acc + item.tempsMoyenReponse, 0);
        // Calcul de la moyenne
        const moyenneGlobal = totalTemps / scores.length;

        return {moyenneGlobal};
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
            totalReponses: userStats.totalReponses,
            bonnesReponses: userStats.bonnesReponses,
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
        const averageTimeToAnswer = attempts.reduce((acc: any, curr: {
          timeToAnswer: any;
        }) => acc + curr.timeToAnswer, 0) / totalAttempts;
        const successRate = (correctAnswers / totalAttempts) * 100;

        return {
          totalAttempts,
          correctAnswers,
          averageTimeToAnswer,
          successRate
        };
      });
      // Save the Mirage database to localStorage before the page unloads
      window.addEventListener('beforeunload', () => {
        localStorage.setItem('mirageData', JSON.stringify(server.db.dump()));
      });
    },
  });
  return server;
}
