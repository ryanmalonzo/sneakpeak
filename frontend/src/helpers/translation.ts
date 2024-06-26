export interface IError {
  name: string
  message: string
  error: string
}
export class Translation {
  /**
   * @param message Erreur de connexion en anglais
   * @returns Erreur de connexion en français
   */
  static loginErrors(message: Error) {
    switch ((message as IError).error) {
      case 'invalid_credentials':
        return 'Identifiants incorrects'

      case 'email_not_verified':
        return 'Email non vérifié'

      case 'wrong_password':
        return 'Mot de passe incorrect'

      default:
        break
    }
  }

  /**
   * @param message Erreur d'inscription en anglais
   * @returns Erreur d'inscription en français
   */
  static registerErrors(message: Error) {
    switch ((message as IError).error) {
      case 'email_already_exists':
        return 'Cette adresse mail est déjà utilisée'

      case 'invalid_password':
        return 'Votre mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'

      default:
        return 'Une erreur est survenue. Veuillez réessayer'
    }
  }
}
