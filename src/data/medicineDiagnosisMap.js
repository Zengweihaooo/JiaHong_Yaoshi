/**
 * 药品 ↔ 线下确诊疾病 对应关系（Mock 后台配置）
 *
 * keywords：药品名称模糊匹配关键字（先匹配更长、更具体的规则）
 * diagnoses：可选关联疾病，名称需与 quickConsultDiagnoses 保持一致
 * disabledDiagnoses：需额外校验后才可选的疾病
 */
export const medicineDiagnosisEntries = [
  {
    id: "escitalopram",
    keywords: ["草酸艾司西酞普兰片"],
    diagnoses: ["认知障碍", "卒中后抑郁", "抑郁发作"],
    disabledDiagnoses: ["抑郁发作"]
  },
  {
    id: "cold-ling",
    keywords: ["感冒灵", "感冒片"],
    diagnoses: ["急性鼻咽炎 [感冒]", "急性咽喉炎", "急性扁桃体炎", "急性支气管炎"]
  },
  {
    id: "compound-paracetamol",
    keywords: ["复方氨酚烷胺"],
    diagnoses: ["急性鼻咽炎 [感冒]", "急性咽喉炎", "急性扁桃体炎", "急性支气管炎"]
  },
  {
    id: "shensu",
    keywords: ["参苏丸"],
    diagnoses: ["急性鼻咽炎 [感冒]", "急性咽喉炎", "急性支气管炎"]
  },
  {
    id: "azithromycin",
    keywords: ["阿奇霉素"],
    diagnoses: [
      "急性支气管炎",
      "急性扁桃体炎",
      "急性咽喉炎",
      "急性肠炎",
      "泌尿道感染",
      "细菌性结膜炎",
      "手皮肤感染",
      "中耳炎",
      "肺炎",
      "支气管哮喘"
    ]
  },
  {
    id: "clarithromycin",
    keywords: ["克拉霉素"],
    diagnoses: [
      "急性支气管炎",
      "急性扁桃体炎",
      "急性咽喉炎",
      "幽门螺旋杆菌感染",
      "泌尿道感染",
      "中耳炎",
      "手皮肤感染",
      "鼻窦炎",
      "肺炎"
    ]
  },
  {
    id: "omeprazole",
    keywords: ["奥美拉唑"],
    diagnoses: ["幽门螺旋杆菌感染", "胃溃疡", "十二指肠溃疡"]
  },
  {
    id: "amoxicillin",
    keywords: ["阿莫西林"],
    diagnoses: [
      "幽门螺旋杆菌感染",
      "急性扁桃体炎",
      "急性支气管炎",
      "急性咽喉炎",
      "泌尿道感染",
      "中耳炎",
      "细菌性结膜炎",
      "手皮肤感染"
    ]
  }
];

/**
 * 联合用药组合（Mock 后台配置）
 * keywords：组合内药品名称关键字，minCount 为触发联合提示的最少未关联药品数
 */
export const combinationTherapyGroups = [
  {
    id: "hpylori-eradication",
    keywords: ["克拉霉素", "奥美拉唑", "阿莫西林"],
    minCount: 2,
    diagnoses: ["幽门螺旋杆菌感染"]
  }
];
