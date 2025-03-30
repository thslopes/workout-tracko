import { push } from '@zos/router'
import { createWidget, widget } from '@zos/ui'
import * as styles from './index.styles'
import { sessionStorage } from '@zos/storage'

const workouts = [
  {
    'name': "Biceps",
    workouts: [
      {
        'name': "Graviton",
        'sets': 4,
      },
      {
        'name': "Remada Articulada 20kg",
        'sets': 3,
      },
      {
        'name': "Serrote 12kg",
        'sets': 3,
      },
      {
        'name': "Rosca Martelo 9kg",
        'sets': 3,
      },
      {
        'name': "Rosca Scott 10kg",
        'sets': 3,
      }
    ]
  },
  {
    'name': "Triceps",
    workouts: [
      {
        'name': "Triceps Pulley",
        'sets': 4,
      },
      {
        'name': "Triceps Testa",
        'sets': 3,
      },
      {
        'name': "Triceps Francês",
        'sets': 3,
      },
      {
        'name': "Triceps Coice",
        'sets': 3,
      }
    ]
  },
  {
    'name': "Pernas",
    workouts: [
      {
        'name': "Agachamento",
        'sets': 4,
      },
      {
        'name': "Leg Press",
        'sets': 3,
      },
      {
        'name': "Cadeira Extensora",
        'sets': 3,
      },
      {
        'name': "Cadeira Flexora",
        'sets': 3,
      }
    ]
  }
]

Page({
  state: {
  },
  build() {
    for (let i = 0; i < workouts.length; i++) {
      createWidget(widget.BUTTON, {
        ...styles.START_BUTTON,
        text: workouts[i].name,
        y: styles.START_BUTTON.y + i * (styles.START_BUTTON.h + 10),
        click_func: () => {
          sessionStorage.setItem('workout', JSON.stringify(workouts[i].workouts))
          push({ url: 'page/doing', params: {} })
        }
      })
        
    }
  }
})
