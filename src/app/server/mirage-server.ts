import {createServer, Response} from 'miragejs';

export function makeServer() {
  createServer({
    seeds(server) {
      // Ajouter un utilisateur par défaut pour la connexion
      server.db.loadData({
        users: [
          {email: 'adrian@jimenez.com', password: 'adrianjimenez'},
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

        // Ajout de l'utilisateur à la base simulée
        // Ajout de l'utilisateur à la base simulée
        schema.db['users'].insert(userData);
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
