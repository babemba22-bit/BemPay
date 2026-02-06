# BemPay - MVP (Minimum Viable Product)

## 1. But du MVP

BemPay est un prototype fonctionnel (MVP) d'une solution de paiement conçue pour les entrepreneurs, freelances et créateurs au Mali. L'objectif est de démontrer la simplicité de créer et partager des liens de paiement pour encaisser des montants en Francs CFA (XOF), avec un suivi basique des transactions.

**Toute l'application est une simulation et fonctionne localement dans votre navigateur, sans nécessiter de backend.**

---

## 2. Routes Disponibles

L'application est structurée comme suit :

-   `/` : Landing page de présentation du service.
-   `/login` : Page de connexion à l'espace administrateur (simulé). Le code d'accès est `1234`.
-   `/dashboard` : Tableau de bord principal où l'on peut créer des liens et consulter la liste des liens existants.
-   `/dashboard/payments` : Page listant toutes les transactions simulées, avec des options de filtrage.
-   `/p/:slug` : Page de paiement publique pour un lien spécifique (ex: `/p/TSHIRT1`).
-   `/payment/success` : Page de confirmation affichée après un paiement réussi.
-   `/payment/failure` : Page affichée après un échec de paiement.

---

## 3. Stockage des Données

Toutes les données (créateur, liens, paiements, session) sont stockées dans le **`localStorage`** de votre navigateur. Il n'y a aucune base de données distante.

**Comment réinitialiser les données ?**

Pour repartir de zéro, ouvrez les outils de développement de votre navigateur, allez dans l'onglet "Application" (ou "Stockage"), trouvez `localStorage` pour ce site, et effacez les clés suivantes :
-   `bempay_creator`
-   `bempay_links`
-   `bempay_payments`
-   `bempay_session`

Au prochain rechargement de la page, les données de démonstration par défaut seront automatiquement recréées.

---

## 4. Tester le Flow de Paiement

1.  Allez sur le tableau de bord (`/dashboard`) après vous être connecté avec le code `1234`.
2.  Créez un lien de paiement via le formulaire.
3.  Dans la liste des liens, cliquez sur l'action "Ouvrir" pour accéder à la page de paiement.
4.  Remplissez le formulaire de paiement (Mobile Money ou Carte).

-   **Pour simuler un succès :** Cliquez sur le bouton principal "Payer...". La simulation a 85% de chances de réussir.
-   **Pour simuler un échec :** Cliquez sur le petit lien "Simuler un échec de paiement" situé sous le bouton principal.

Après la simulation, vous serez redirigé vers la page de succès ou d'échec. Le statut du lien (`PAID`) et la transaction correspondante seront visibles dans le tableau de bord.

---

## 5. Limitations du MVP

-   **Paiements simulés :** Aucune transaction financière réelle n'est effectuée. Les numéros de carte ou de téléphone ne sont pas envoyés à un prestataire.
-   **Sécurité de production absente :** L'authentification par code PIN (`1234`) est uniquement à des fins de démonstration et n'offre aucune sécurité réelle.
-   **Pas de gestion multi-utilisateurs :** Le prototype ne gère qu'un seul "créateur" à la fois.

---

## 6. Prochaines Étapes pour un Paiement Réel

Pour transformer ce MVP en une solution de production, les étapes suivantes sont nécessaires :

1.  **Backend Robuste :** Mettre en place un serveur backend (ex: Node.js, Python avec un framework comme Express ou FastAPI) et une base de données (ex: PostgreSQL, Firestore) pour gérer les utilisateurs, les liens et les paiements de manière sécurisée.
2.  **Intégration d'un Prestataire de Paiement :** Intégrer une API de paiement réelle (ex: Stripe, Paystack, ou un agrégateur local pour Orange Money) pour traiter les transactions.
3.  **Webhooks :** Configurer des webhooks pour que le prestataire de paiement puisse notifier le backend de l'état des transactions (ex: `payment.succeeded`, `payment.failed`). Le backend mettra alors à jour la base de données de manière fiable.
4.  **Authentification Sécurisée :** Remplacer le système de code PIN par une authentification standard et sécurisée (ex: email/mot de passe avec JWT, OAuth).
