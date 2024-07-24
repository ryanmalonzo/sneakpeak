//Gestion des codes erreur générique du serveur
export function handleError(response: Response) {
  if (response.status === 401) {
    return "Vous n'etes pas connecté"
  }
}
