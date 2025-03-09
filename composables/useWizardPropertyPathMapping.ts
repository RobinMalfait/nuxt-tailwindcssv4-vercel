type WizardPropertyPathsType = {
  [routeName: string]: string[]
}
export const useWizardPropertyPathMapping = () => {
  const mapping: WizardPropertyPathsType = {
    abstract: [
      'paperAbstract',
      'paperAbstract.mainIssue',
      'paperAbstract.studyAim',
      'paperAbstract.studyType',
      'studyGroups',
      'studyGroups.label',
      'studyGroups.interventionComparatorItems',
      'paperAbstract.settingLabel.shortLabel',
      'paperAbstract.participantsLabel.shortLabel',
      'paperAbstract.measured',
      'paperAbstract.findings',
      'paperAbstract.generalizableConclusions'
    ],
    'additional-results-tables': [
      'additionalResultsTables.*',
      'additionalResultsTables.resultsTableColumns.*',
      'additionalResultsTables.resultsTableColumns.resultsTableValues.*',
      'additionalResultsTables.resultsTableRows.*'
    ],
    'additional-results-text': [
      'additionalResultsText.*',
      'additionalResultsText.questionFindings.*'
    ],
    analysis: ['analysis.*', 'analysis.analysisQuestionItems.*'],
    'baseline-characteristics-table': [
      'baselineCharacteristicsTable.*',
      'baselineCharacteristicsTable.baselineCharacteristics.*',
      'baselineCharacteristicsTable.baselineCharacteristicColumns.*',
      'baselineCharacteristicsTable.baselineCharacteristicColumns.baselineCharacteristicValues.*'
    ],
    'baseline-characteristics-text': ['baselineCharacteristicsText.*'],
    'changes-in-study': ['changesInStudy.*'],
    conclusions: ['conclusions.*'],
    contributors: ['paperAuthors.*', 'Paper.correspondingAuthor'],
    design: ['design.*'],
    'deviations-from-protocol': ['deviationFromProtocol.*'],
    'future-research': ['future-research.*'],
    'importance-and-timeliness': ['importanceAndTimeliness.*'],
    'intervention-comparator': [
      'interventionComparator.*',
      'studyGroups.interventionComparatorItems.*'
    ],
    limitations: ['limitations.*'],
    'main-results-table': [
      'mainResultsTable.*',
      'mainResultsTable.resultsTableColumns.*',
      'mainResultsTable.resultsTableColumns.resultsTableValues.*',
      'mainResultsTable.resultsTableRows.*'
    ],
    'main-results-text': ['mainResultsText.*'],
    measures: ['measures.*'],
    'mechanisms-of-action': ['mechanismsOfAction.*'],
    metadata: [
      'title',
      'shortTitle',
      'keywords',
      'supportingOrganisations',
      'acknowledgements',
      'trialStudyUrl',
      'trialStudyNumber',
      'studyProtocolUrl',
      'ethicsApprovals'
    ],
    'participant-flow': [
      'participantFlow.*',
      'participantFlow.totals.*',
      'participantFlow.totals.participantTotalsCategories.*'
    ],
    participants: ['participants.*'],
    'practical-implications': ['practicalImplications.*'],
    procedures: ['procedureItems.*'],
    'reason-for-study-design': ['studyDesignReason.*'],
    references: [],
    'research-question-answer': [
      'researchQuestionAnswer.*',
      'researchQuestionAnswer.researchQuestionAnswerFindings.*'
    ],
    'research-questions': [
      'researchQuestion',
      'researchQuestion.researchQuestionItems.*',
      'researchQuestion.researchQuestionItems.participantsLabel',
      'researchQuestion.researchQuestionItems.settingLabel'
    ],
    'sample-size-determination': ['sampleSizeDetermination.*', 'studyGroups.intendedSampleSize'],
    setting: ['setting.*'],
    'study-topic-aims': [
      'studyTopicAims',
      'studyTopicAims.mainIssue',
      'studyTopicAims.topic',
      'studyTopicAims.studyFocus',
      'studyTopicAims.studyAim'
    ],
    'supplementary-materials': ['supplementaryMaterials.*'],
    'theoretical-implications': ['theoreticalImplications.*']
  }
  return {
    mapping
  }
}
