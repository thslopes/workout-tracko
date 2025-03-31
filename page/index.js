import { push } from '@zos/router'
import { sessionStorage } from '@zos/storage'
import { createWidget, widget } from '@zos/ui'
import * as styles from './index.styles'

const workouts = [
  {
    'name': "Biceps",
    workouts: [
      {
        'name': "Graviton 50kg x7",
        'sets': 4,
      },
      {
        'name': "Puxada Articulada 40kg x12",
        'sets': 3,
      },
      {
        'name': "Remada Articulada 30kg x12",
        'sets': 3,
      },
      {
        'name': "Serrote 20kg x7",
        'sets': 3,
      },
      {
        'name': "Rosca Martelo 12kg x7",
        'sets': 3,
      },
      {
        'name': "Rosca Scott 10kg x12",
        'sets': 3,
      },
      {
        'name': "Encolhimento 12kg x12",
        'sets': 3,
      }
    ]
  },
  {
    'name': "Triceps",
    workouts: [
      {
        'name': "Cross 10kg x20",
        'sets': 4,
      },
      {
        'name': "Supino reto 14kg x12",
        'sets': 3,
      },
      {
        'name': "Supino sentado 20kg x7",
        'sets': 2,
      },
      {
        'name': "Desenvolvimento 7kg x12",
        'sets': 3,
      },
      {
        'name': "Tríceps barra 60kg 7",
        'sets': 3,
      },
    ]
  },
  {
    'name': "Pernas",
    workouts: [
      {
        'name': "Agachamento barra 20kg x12",
        'sets': 3,
      },
      {
        'name': "Stiff 26kg x12",
        'sets': 3,
      },
      {
        'name': "Panturrilha em pé 20kg x12",
        'sets': 3,
      },
      {
        'name': "Sumo 32kg x12",
        'sets': 2,
      },
      {
        'name': "Mesa flexora 25kg x7",
        'sets': 4,
      },
      {
        'name': "Cadeira extensora 30kg x7",
        'sets': 4,
      }
    ]
  },
  {
    'name': "Corrida",
    'external': true,
    workouts: [
      {
        'name': "Aquecimento",
        'duration': 20 * 1000,
      },
      {
        'name': "Sprint",
        'duration': 30,
        'sets': 10,
        'rest': 90,
      },
      {
        'name': "Desaceleração"
      }
    ]
  }
]

Page({
  state: {
  },
  build() {
    if (sessionStorage.getItem('startTime', 0)) {
      push({ url: 'page/doing', params: {} })
    }
    for (let i = 0; i < workouts.length; i++) {
      createWidget(widget.BUTTON, {
        ...styles.START_BUTTON,
        text: workouts[i].name,
        y: styles.START_BUTTON.y + i * (styles.START_BUTTON.h + 10),
        click_func: () => {
          sessionStorage.setItem('workout', JSON.stringify(workouts[i].workouts))
          sessionStorage.setItem('external', workouts[i].external ? 1 : 0)
          push({ url: 'page/doing', params: {} })
        }
      })
      // sessionStorage.setItem('workout', JSON.stringify(workouts[0].workouts))
      // sessionStorage.setItem('external', workouts[3].external ? 1 : 0)
      // push({ url: 'page/doing', params: {} })
    }
  }
})
