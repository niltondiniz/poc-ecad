//Função responsável por formatar o tempo para exibição
export const formatTime = (time: number): string => {    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const getTwoRandomNumbers = () => {
    //dois algarismos aleatórios
    const random = Math.floor(Math.random() * 100);
    return random.toString().padStart(2, '0');

  }