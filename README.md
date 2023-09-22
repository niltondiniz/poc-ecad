# Wavesurfer ECAD component

O objetivo desta POC além de validar o componente wavesurfer, é também criar um candidato a componente final.
Os pontos utilizados pelo ECAD foram levados em consideração para a criação desta POC.

## Conteudo da POC

- WavesurferHook
  - Hook que encapsula as funcionalidades basicas, e exporta o componente wavesurfer bem como seus plugins para extensão. Podendo assim ser utilizado todo recurso da biblioteca.
- WavesurferPlayer
  - Componente que utiliza o Wavesurfer. Este componente é um facilitador para utilizar os eventos e propriedades do Wavesurfer, trazendo subscrição nos eventos, propriedades e etc.
- App
  - Componente de exemplo complexo, trazendo a maior parte das funcionalidades presentes nos requisitos do ECAD. Implementa eventos tanto do Wavesurfer quanto de regiões. O componente exemplifica a utilização dos recursos avançados do waveform, como carregamento de picos (peaks), registro em eventos, exibição de dados nas regiões (tooltip) e etc.
- WavesurferProps.Interface
  - Tipagem dos Props utilizados no wavesurfer documentado.

