import type { Draft, Workspace } from "./contracts";

export const sampleDraft: Draft = {
  id: "draft_qingshan_v1",
  version: 7,
  projectId: "project_qingshan",
  title: "青山旧梦 - 第一版改编",
  status: "active",
  scenes: [
    {
      id: "scene_001",
      version: 2,
      actId: "act_01",
      title: "雨夜归来",
      heading: "外景 青山县车站外 夜晚",
      location: "青山县车站外",
      timeOfDay: "夜晚",
      atmosphere: "阴冷、压抑",
      purpose: "交代林晚回到故乡及内心抗拒。",
      conflictLevel: 4,
      durationEstimateMinutes: 2,
      characterIds: ["char_001"],
      sourceChapterIds: ["chapter_001"],
      status: "validated",
      emotionalCurve: {
        start: "克制",
        end: "沉重"
      },
      cameraSuggestions: [
        {
          shotType: "wide",
          target: "车站",
          description: "雨夜车站全景，林晚独自站在灯下。"
        },
        {
          shotType: "close_up",
          target: "林晚",
          description: "林晚看向远处街道，表情克制。"
        }
      ],
      blocks: [
        {
          id: "block_001",
          version: 1,
          type: "scene_heading",
          text: "外景 青山县车站外 夜晚",
          sourceRefs: [
            {
              chapterId: "chapter_001",
              paragraphRange: [1, 1],
              adaptationType: "rewrite"
            }
          ],
          provenance: "ai",
          validationIssueIds: []
        },
        {
          id: "block_002",
          version: 1,
          type: "action",
          text: "雨水打在车站外的路面上，林晚拖着行李箱站在路灯下。",
          sourceRefs: [
            {
              chapterId: "chapter_001",
              paragraphRange: [1, 1],
              adaptationType: "rewrite"
            }
          ],
          provenance: "ai",
          validationIssueIds: []
        },
        {
          id: "block_003",
          version: 1,
          type: "note",
          text: "镜头保持远景，强调她与故乡之间的距离。",
          sourceRefs: [
            {
              chapterId: "chapter_001",
              paragraphRange: [1, 2],
              adaptationType: "invented"
            }
          ],
          provenance: "ai",
          validationIssueIds: []
        }
      ]
    },
    {
      id: "scene_002",
      version: 3,
      actId: "act_01",
      title: "医院重逢",
      heading: "内景 县医院走廊 夜晚",
      location: "县医院走廊",
      timeOfDay: "夜晚",
      atmosphere: "安静、紧张",
      purpose: "引出林晚与沈亦川的旧关系。",
      conflictLevel: 6,
      durationEstimateMinutes: 3,
      characterIds: ["char_001", "char_002"],
      sourceChapterIds: ["chapter_002"],
      status: "needs_revision",
      emotionalCurve: {
        start: "平静",
        end: "戒备"
      },
      cameraSuggestions: [
        {
          shotType: "over_shoulder",
          target: "林晚",
          description: "从林晚肩后看向走廊尽头的沈亦川。"
        },
        {
          shotType: "close_up",
          target: "信封",
          description: "林晚握紧手里的信封。"
        }
      ],
      blocks: [
        {
          id: "block_004",
          version: 1,
          type: "scene_heading",
          text: "内景 县医院走廊 夜晚",
          sourceRefs: [
            {
              chapterId: "chapter_002",
              paragraphRange: [1, 1],
              adaptationType: "rewrite"
            }
          ],
          provenance: "ai",
          validationIssueIds: []
        },
        {
          id: "block_005",
          version: 1,
          type: "action",
          text: "林晚推开急诊室的门，走廊里弥漫着消毒水的味道。",
          sourceRefs: [
            {
              chapterId: "chapter_002",
              paragraphRange: [1, 2],
              adaptationType: "rewrite"
            }
          ],
          provenance: "ai",
          validationIssueIds: []
        },
        {
          id: "block_006",
          version: 1,
          type: "character",
          text: "沈亦川",
          speakerId: "char_002",
          sourceRefs: [
            {
              chapterId: "chapter_002",
              paragraphRange: [3, 3],
              adaptationType: "direct"
            }
          ],
          provenance: "ai",
          validationIssueIds: []
        },
        {
          id: "block_007",
          version: 1,
          type: "dialogue",
          text: "林晚？",
          speakerId: "char_002",
          parenthetical: "意外",
          sourceRefs: [
            {
              chapterId: "chapter_002",
              paragraphRange: [3, 3],
              adaptationType: "direct"
            }
          ],
          provenance: "ai",
          validationIssueIds: []
        },
        {
          id: "block_008",
          version: 1,
          type: "dialogue",
          text: "我只是回来处理一些旧事。",
          speakerId: "char_001",
          parenthetical: "疏离",
          sourceRefs: [
            {
              chapterId: "chapter_002",
              paragraphRange: [6, 6],
              adaptationType: "direct"
            }
          ],
          provenance: "ai",
          validationIssueIds: ["issue_dialogue_subtext"]
        }
      ]
    },
    {
      id: "scene_003",
      version: 2,
      actId: "act_02",
      title: "老宅脚步声",
      heading: "内景 林家老宅书房 深夜",
      location: "林家老宅书房",
      timeOfDay: "深夜",
      atmosphere: "悬疑、危险",
      purpose: "抛出旧案疑点，并制造悬念。",
      conflictLevel: 8,
      durationEstimateMinutes: 4,
      characterIds: ["char_001"],
      sourceChapterIds: ["chapter_003"],
      status: "reviewing",
      emotionalCurve: {
        start: "疑惑",
        end: "紧张"
      },
      cameraSuggestions: [
        {
          shotType: "close_up",
          target: "照片背面",
          description: "镜头聚焦照片背面的字迹。"
        },
        {
          shotType: "medium",
          target: "林晚",
          description: "林晚关灯后蹲在书桌旁，紧张看向门口。"
        }
      ],
      blocks: [
        {
          id: "block_009",
          version: 1,
          type: "scene_heading",
          text: "内景 林家老宅书房 深夜",
          sourceRefs: [
            {
              chapterId: "chapter_003",
              paragraphRange: [1, 1],
              adaptationType: "rewrite"
            }
          ],
          provenance: "ai",
          validationIssueIds: ["issue_scene_density"]
        },
        {
          id: "block_010",
          version: 1,
          type: "action",
          text: "林晚拉开书房抽屉，在最里面发现一张泛黄的照片。",
          sourceRefs: [
            {
              chapterId: "chapter_003",
              paragraphRange: [1, 2],
              adaptationType: "rewrite"
            }
          ],
          provenance: "ai",
          validationIssueIds: []
        },
        {
          id: "block_011",
          version: 1,
          type: "beat",
          text: "不要相信当年的结论。",
          sourceRefs: [
            {
              chapterId: "chapter_003",
              paragraphRange: [3, 3],
              adaptationType: "direct"
            }
          ],
          provenance: "ai",
          validationIssueIds: []
        },
        {
          id: "block_012",
          version: 1,
          type: "transition",
          text: "窗外传来脚步声。",
          sourceRefs: [
            {
              chapterId: "chapter_003",
              paragraphRange: [4, 5],
              adaptationType: "rewrite"
            }
          ],
          provenance: "ai",
          validationIssueIds: ["issue_trace_precision"]
        },
        {
          id: "block_013",
          version: 1,
          type: "parenthetical",
          text: "屏住呼吸",
          sourceRefs: [
            {
              chapterId: "chapter_003",
              paragraphRange: [5, 5],
              adaptationType: "rewrite"
            }
          ],
          provenance: "ai",
          validationIssueIds: []
        },
        {
          id: "block_014",
          version: 1,
          type: "separator",
          text: "***",
          sourceRefs: [],
          provenance: "ai",
          validationIssueIds: []
        }
      ]
    }
  ]
};

export const sampleWorkspace: Workspace = {
  project: {
    id: "project_qingshan",
    version: 4,
    title: "青山旧梦",
    sourceTitle: "青山旧梦",
    chapterCount: 3,
    activeDraftId: sampleDraft.id,
    updatedAt: "2026-06-07T02:00:00.000Z"
  },
  draft: sampleDraft,
  chapters: [
    {
      id: "chapter_001",
      title: "第一章 归来",
      paragraphs: [
        {
          id: "chapter_001_p001",
          index: 1,
          text: "雨水打在青山县车站外的路面上，林晚拖着行李箱站在路灯下。"
        },
        {
          id: "chapter_001_p002",
          index: 2,
          text: "三年前，她发誓再也不回来。现在，一封父亲留下的信把她带回了这里。"
        }
      ]
    },
    {
      id: "chapter_002",
      title: "第二章 重逢",
      paragraphs: [
        {
          id: "chapter_002_p001",
          index: 1,
          text: "县医院的走廊很安静，消毒水的味道让林晚停住脚步。"
        },
        {
          id: "chapter_002_p003",
          index: 3,
          text: "走廊尽头的人抬起头，低声喊出她的名字：林晚？"
        },
        {
          id: "chapter_002_p006",
          index: 6,
          text: "林晚握紧信封，只说自己回来处理一些旧事。"
        }
      ]
    },
    {
      id: "chapter_003",
      title: "第三章 旧案",
      paragraphs: [
        {
          id: "chapter_003_p001",
          index: 1,
          text: "林家老宅书房的抽屉卡得很紧，林晚在最里面摸到一张泛黄照片。"
        },
        {
          id: "chapter_003_p003",
          index: 3,
          text: "照片背面写着一行字：不要相信当年的结论。"
        },
        {
          id: "chapter_003_p005",
          index: 5,
          text: "窗外忽然传来脚步声，她关掉台灯，屏住呼吸看向门口。"
        }
      ]
    }
  ],
  characters: [
    {
      id: "char_001",
      name: "林晚",
      role: "protagonist",
      description: "回到青山县调查父亲旧事的年轻女性。",
      traits: ["冷静", "克制", "谨慎"],
      goals: ["查清父亲信中提到的真相"],
      appearances: ["scene_001", "scene_002", "scene_003"],
      relationships: [
        {
          characterId: "char_002",
          label: "旧识"
        }
      ]
    },
    {
      id: "char_002",
      name: "沈亦川",
      role: "supporting",
      description: "林晚的旧识，似乎知道旧案相关信息。",
      traits: ["沉默", "隐忍"],
      goals: ["隐藏部分旧事"],
      appearances: ["scene_002"],
      relationships: [
        {
          characterId: "char_001",
          label: "旧识"
        }
      ]
    }
  ],
  locations: [
    {
      id: "loc_station",
      name: "青山县车站外",
      description: "林晚回到故乡的第一处场景。",
      sceneIds: ["scene_001"],
      sourceRefs: [
        {
          chapterId: "chapter_001",
          paragraphRange: [1, 2],
          adaptationType: "rewrite"
        }
      ]
    },
    {
      id: "loc_hospital",
      name: "县医院走廊",
      description: "林晚与沈亦川重逢的地方。",
      sceneIds: ["scene_002"],
      sourceRefs: [
        {
          chapterId: "chapter_002",
          paragraphRange: [1, 6],
          adaptationType: "rewrite"
        }
      ]
    },
    {
      id: "loc_old_house",
      name: "林家老宅书房",
      description: "旧案线索被发现的房间。",
      sceneIds: ["scene_003"],
      sourceRefs: [
        {
          chapterId: "chapter_003",
          paragraphRange: [1, 5],
          adaptationType: "rewrite"
        }
      ]
    }
  ],
  storyThreads: [
    {
      id: "thread_old_case",
      title: "父亲旧案",
      status: "developing",
      sceneIds: ["scene_001", "scene_003"],
      sourceRefs: [
        {
          chapterId: "chapter_001",
          paragraphRange: [2, 2],
          adaptationType: "rewrite"
        }
      ]
    },
    {
      id: "thread_shen_secret",
      title: "沈亦川隐瞒的信息",
      status: "open",
      sceneIds: ["scene_002"],
      sourceRefs: [
        {
          chapterId: "chapter_002",
          paragraphRange: [3, 6],
          adaptationType: "rewrite"
        }
      ]
    }
  ],
  generationJobs: [
    {
      id: "job_generate_001",
      state: "running",
      stage: "continuity_check",
      progress: 72,
      outputRefs: ["draft_qingshan_v1", "quality_qingshan_v1"]
    }
  ],
  exportJobs: [
    {
      id: "export_yaml_001",
      draftId: sampleDraft.id,
      format: "yaml",
      state: "succeeded",
      progress: 100,
      validationStatus: "valid",
      artifactUrl: "/exports/qingshan.yaml",
      manifestUrl: "/exports/qingshan.trace.json"
    },
    {
      id: "export_pdf_001",
      draftId: sampleDraft.id,
      format: "pdf",
      state: "running",
      progress: 58,
      validationStatus: "warning"
    },
    {
      id: "export_fdx_001",
      draftId: sampleDraft.id,
      format: "fdx",
      state: "queued",
      progress: 0,
      validationStatus: "valid"
    }
  ],
  assets: [
    {
      id: "asset_source_001",
      name: "novel_sample.md",
      fileType: "markdown",
      sizeLabel: "4 KB",
      source: "uploaded source",
      url: "/assets/novel_sample.md"
    },
    {
      id: "asset_yaml_001",
      name: "screenplay_output.yaml",
      fileType: "yaml",
      sizeLabel: "9 KB",
      source: "export_yaml_001",
      draftId: sampleDraft.id,
      jobId: "export_yaml_001",
      url: "/exports/qingshan.yaml"
    }
  ],
  revisions: [
    {
      id: "revision_001",
      label: "AI 初稿",
      createdAt: "2026-06-07T01:28:00.000Z",
      author: "Script Planner Agent",
      summary: "从三章小说生成三场剧本结构。",
      changedBlockIds: ["block_001", "block_004", "block_009"]
    },
    {
      id: "revision_002",
      label: "对白润色",
      createdAt: "2026-06-07T01:46:00.000Z",
      author: "Dialogue Agent",
      summary: "调整医院重逢一场的潜台词。",
      changedBlockIds: ["block_007", "block_008"]
    }
  ],
  quality: {
    overallScore: 88,
    dimensions: [
      {
        key: "plot_coherence",
        label: "剧情连贯性",
        score: 91,
        comment: "三场推进清晰，旧案线索递进明确。"
      },
      {
        key: "character_consistency",
        label: "人物一致性",
        score: 86,
        comment: "林晚的克制稳定，但沈亦川的隐瞒动机可再强化。"
      },
      {
        key: "dialogue_naturalness",
        label: "对白自然度",
        score: 89,
        comment: "对白短促克制，符合悬疑语气。"
      },
      {
        key: "scene_structure",
        label: "场景结构",
        score: 84,
        comment: "第三场动作密度偏高，需要留出反应节拍。"
      },
      {
        key: "yaml_validity",
        label: "YAML 合法性",
        score: 93,
        comment: "结构完整，可用于后续导出。"
      }
    ],
    metrics: {
      pageCount: 4,
      sceneCount: 3,
      beatCount: 14,
      dialogueBlocks: 2,
      actionBlocks: 3,
      locationCount: 3
    },
    issues: [
      {
        id: "issue_dialogue_subtext",
        severity: "warning",
        code: "DIALOGUE_SUBTEXT_WEAK",
        message: "林晚对白可以增加潜台词。",
        suggestion: "保留短句，但加入对信封或旧案的暗示。",
        sceneId: "scene_002",
        blockId: "block_008"
      },
      {
        id: "issue_scene_density",
        severity: "error",
        code: "SCENE_DENSITY_HIGH",
        message: "第三场线索、动作和惊吓集中在同一段。",
        suggestion: "在发现照片和听到脚步声之间加入一个停顿 beat。",
        sceneId: "scene_003",
        blockId: "block_009"
      },
      {
        id: "issue_trace_precision",
        severity: "warning",
        code: "TRACE_RANGE_BROAD",
        message: "脚步声转场的 source trace 范围可以更精确。",
        suggestion: "将来源范围收窄到第三章第 5 段。",
        sceneId: "scene_003",
        blockId: "block_012"
      }
    ]
  },
  validationIssues: [
    {
      id: "issue_dialogue_subtext",
      severity: "warning",
      code: "DIALOGUE_SUBTEXT_WEAK",
      message: "林晚对白可以增加潜台词。",
      suggestion: "保留短句，但加入对信封或旧案的暗示。",
      sceneId: "scene_002",
      blockId: "block_008"
    },
    {
      id: "issue_scene_density",
      severity: "error",
      code: "SCENE_DENSITY_HIGH",
      message: "第三场线索、动作和惊吓集中在同一段。",
      suggestion: "在发现照片和听到脚步声之间加入一个停顿 beat。",
      sceneId: "scene_003",
      blockId: "block_009"
    },
    {
      id: "issue_trace_precision",
      severity: "warning",
      code: "TRACE_RANGE_BROAD",
      message: "脚步声转场的 source trace 范围可以更精确。",
      suggestion: "将来源范围收窄到第三章第 5 段。",
      sceneId: "scene_003",
      blockId: "block_012"
    }
  ]
};
