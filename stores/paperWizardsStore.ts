import {defineStore} from "pinia";
import {computed} from "vue";

type WizardGroupType = {
  groupName?: string
  wizards: WizardType[]
}

type WizardType = {
  name: string
  routeName: string
  isComplete: ComputedRef<boolean|undefined>
  errorCount: ComputedRef<number>
}

type WizardColumns = WizardGroupType[][]

type WizardParamType = { routeName: string, name: string }

export const usePaperWizardsStore = defineStore('paper-wizards', () => {
  const route = useRoute()
  const { mapping } = useWizardPropertyPathMapping()
  const validationStore = usePaperValidationStore()
  const paperStudyType = ref()

  const currentWizard = computed(() => {
    for (const wizard of allWizards.value) {
      for (const matchedRoute of route.matched) {
        if (wizard.routeName === matchedRoute.name) {
          return wizard
        }
      }
    }
  })

  function setWizardsByPaperStudyType (newPaperStudyType: string) {
    paperStudyType.value = newPaperStudyType
  }

  const wizards = computed<WizardColumns>(() => {
    function createWizard(wizard: WizardParamType): WizardType {
      return {
        ...wizard,
        isComplete: computed(() => {
          if (!mapping[wizard.routeName]) return undefined
          return validationStore.areFieldsComplete(mapping[wizard.routeName])
        }),
        errorCount: computed(() => {
          if (!mapping[wizard.routeName]) return 0
          return validationStore.fieldErrorCount(mapping[wizard.routeName])
        })
      }
    }

    function createWizardGroup (groupName: string|undefined, wizards: WizardParamType[]): WizardGroupType {
      return {
        groupName,
        wizards: wizards.map((w: WizardParamType) => createWizard(w))
      }
    }

    const newWizards: WizardColumns = [[], [], [], []]
    const isPaperRct = paperStudyType.value === 'full-scale-rct'

    newWizards[0].push(
      createWizardGroup(
        undefined,
        [
          {
            name: 'Contributors',
            routeName: 'contributors'
          },
          {
            name: 'Paper metadata',
            routeName: 'metadata'
          },
          {
            name: 'Abstract',
            routeName: 'abstract'
          }
        ]
      ),
      createWizardGroup(
        'Introduction',
        [
          {
            name: 'Study topic & aims',
            routeName: 'study-topic-aims'
          },
          {
            name: 'Research questions',
            routeName: 'research-questions'
          },
          {
            name: 'Importance & timeliness',
            routeName: 'importance-and-timeliness'
          },
          {
            name: 'Rationale for design',
            routeName: 'reason-for-study-design'
          },
          {
            name: 'Mechanisms of action',
            routeName: 'mechanisms-of-action'
          }
        ]
      )
    )

    const deviationsWizard: WizardParamType = isPaperRct ?
      { name: 'Deviations from protocol', routeName: 'deviations-from-protocol' } :
      { name: 'Changes in study', routeName: 'changes-in-study' }

    newWizards[1].push(createWizardGroup('Methods', [
      {
        name: 'Design',
        routeName: 'design'
      },
      {
        name: 'Setting',
        routeName: 'setting'
      },
      {
        name: 'Participants',
        routeName: 'participants'
      },
      {
        name: 'Sample size determination',
        routeName: 'sample-size-determination'
      },
      {
        name: 'Procedures',
        routeName: 'procedures'
      },
      {
        name: 'Interventions',
        routeName: 'intervention-comparator'
      },
      {
        name: 'Constructs & Measures',
        routeName: 'measures'
      },
      {
        name: 'Analysis',
        routeName: 'analysis'
      },
      deviationsWizard
    ]))

    newWizards[2].push(createWizardGroup('Results', [
      {
        name: 'Baseline characteristics table',
        routeName: 'baseline-characteristics-table'
      },
      {
        name: 'Baseline characteristics text',
        routeName: 'baseline-characteristics-text'
      },
      {
        name: 'Participant flow',
        routeName: 'participant-flow'
      },
      {
        name: 'Main results table',
        routeName: 'main-results-table'
      },
      {
        name: 'Main results text',
        routeName: 'main-results-text'
      },
      {
        name: 'Additional results tables',
        routeName: 'additional-results-tables'
      },
      {
        name: 'Additional results text',
        routeName: 'additional-results-text'
      }
    ]))

    newWizards[3].push(
      createWizardGroup('Discussion', [
        {
          name: 'Answers to research questions',
          routeName: 'research-question-answer'
        },
        {
          name: 'Theoretical implications',
          routeName: 'theoretical-implications'
        },
        {
          name: 'Practical implications',
          routeName: 'practical-implications'
        },
        {
          name: 'Limitations',
          routeName: 'limitations'
        },
        {
          name: 'Future research',
          routeName: 'future-research'
        }
      ]),
      createWizardGroup(undefined, [
        {
          name: 'Conclusions',
          routeName: 'conclusions'
        },
        {
          name: 'References',
          routeName: 'references'
        },
        {
          name: 'Supplementary materials',
          routeName: 'supplementary-materials'
        }
      ])
    )

    return newWizards
  })

  const allWizards = computed<WizardType[]>(() => {
    return wizards.value.flat(1).map((group) => {
      return group.wizards
    }).flat()
  })

  return {
    wizards,
    setWizardsByPaperStudyType,
    currentWizard,
    allWizards
  }
})
