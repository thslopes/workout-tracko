import { push } from '@zos/router'
import { localStorage } from '@zos/storage'
import { createWidget, widget } from '@zos/ui'
import * as styles from './index.styles'

const workouts = [
  {
    'name': "Biceps",
    workouts: [
      {
        'name': "Graviton 35kg x3",
        'sets': 5,
        'rest': 20,
      },
      {
        'name': "Puxada Articulada 40kg x12",
        'sets': 3,
      },
      {
        'name': "Remada Articulada 35kg x12",
        'sets': 3,
      },
      {
        'name': "Serrote 22kg x7",
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
        'name': "paralela 50kg x3",
        'sets': 5,
      },
      {
        'name': "Supino reto 17kg x12",
        'sets': 3,
      },
      {
        'name': "Supino inclinado 10kg x12",
        'sets': 3,
      },
      {
        'name': "Cross 15kg x12",
        'sets': 3,
      },
      {
        'name': "Supino sentado 30kg x7",
        'sets': 3,
      },
      {
        'name': "Desenvolvimento 10kg x12",
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
        'name': "Agachamento barra 30kg x12",
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
        'name': "Sumo 45kg x12",
        'sets': 3,
      },
      {
        'name': "Mesa flexora 50kg x7",
        'sets': 3,
      },
      {
        'name': "Cadeira extensora 50kg x7",
        'sets': 3,
      }
    ]
  },
  {
    'name': "Sprints",
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
  },
  {
    'name': "Endurance",
    'external': true,
    workouts: [
      {
        'name': "Aquecimento",
        'duration': 5 * 60,
      },
      {
        'name': "Correr",
        'duration': 4 * 60,
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
    if (localStorage.getItem('startTime', 0)) {
      push({ url: 'page/doing', params: {} })
    }
    for (let i = 0; i < workouts.length; i++) {
      createWidget(widget.BUTTON, {
        ...styles.START_BUTTON,
        text: workouts[i].name,
        y: styles.START_BUTTON.y + i * (styles.START_BUTTON.h + 10),
        click_func: () => {
          localStorage.setItem('workout', JSON.stringify(workouts[i].workouts))
          localStorage.setItem('external', workouts[i].external ? 1 : 0)
          push({ url: 'page/doing', params: {} })
        }
      })
      // localStorage.setItem('workout', JSON.stringify(workouts[0].workouts))
      // localStorage.setItem('external', workouts[3].external ? 1 : 0)
      // push({ url: 'page/map', params: {} })
    }
  }
})
