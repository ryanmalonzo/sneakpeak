export interface IError {
  name: string;
  message: string;
  error: string;
}
export class Traduction {
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
}
