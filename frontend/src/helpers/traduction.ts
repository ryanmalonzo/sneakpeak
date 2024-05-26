export class Traduction {
  /**
   * @param message Erreur de connexion en anglais
   * @returns Erreur de connexion en français
   */
  static loginErrors(message: string) {
    switch (message) {
      case 'invalid_credentials':
        return 'Utilisateur inconnu'

      case 'email_not_verified':
        return 'Email non vérifié'

      case 'wrong_password':
        return 'Mot de passe incorrect'

      default:
        break
    }
  }
}
