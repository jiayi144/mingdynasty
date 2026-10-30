// 核心状态数据
let gameState = {
    name: "无名氏",
    skill: "",
    health: 100,
    money: 0,
    status: 1,
    knowledge: 0,
    family: "",
    correct0: 0,
    diseaseCorrect: 0,
    middleCorrect: 0
};

// UI DOM 元素
const elHealth = document.getElementById('val-health');
const elMoney = document.getElementById('val-money');
const elStatus = document.getElementById('val-status');
const elKnowledge = document.getElementById('val-knowledge');
const elStory = document.getElementById('story-text');
const elChoices = document.getElementById('choices-container');

// 更新顶部状态栏
function updateUI() {
    elHealth.innerText = gameState.health;
    elMoney.innerText = `$${gameState.money}`;
    elStatus.innerText = gameState.status;
    elKnowledge.innerText = gameState.knowledge;
}

// 渲染剧情文本与按钮
function renderScene(title, text, options) {
    updateUI();
    elStory.innerHTML = title ? `<div class="story-title">${title}</div>${text}` : text;
    elChoices.innerHTML = '';

    options.forEach(opt => {
        if (opt.type === 'input') {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = opt.placeholder || '';
            input.className = 'input-box';
            
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = opt.text;
            btn.onclick = () => {
                const val = input.value.trim() || "无名氏";
                opt.action(val);
            };
            
            elChoices.appendChild(input);
            elChoices.appendChild(btn);
        } else {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = opt.text;
            btn.onclick = opt.action;
            elChoices.appendChild(btn);
        }
    });
}

// ==================== 游戏开局 ====================
function startGame() {
    gameState = { name: "无名氏", skill: "", health: 100, money: 0, status: 1, knowledge: 0, family: "", correct0: 0, diseaseCorrect: 0, middleCorrect: 0 };
    
    renderScene(
        "苍茫明途：人生浮沉录",
        "【前尘背景】：身处大明盛世与乱世交错之纪，商潮汹涌，风云变幻，苍生如芥。\n【终极宿命】：一念之间，执掌乾坤。且看你如何在这万丈红尘中，书写独属于你的传奇与绝响！",
        [
            {
                type: 'input',
                placeholder: '请输入你在世间的称谓...',
                text: '踏入红尘',
                action: (name) => {
                    gameState.name = name;
                    chooseSkill();
                }
            }
        ]
    );
}

function chooseSkill() {
    renderScene(
        "选择宿命天赋",
        `阁下 ${gameState.name}，命盘初启，请选择你降生时自带的宿命羁绊：`,
        [
            {
                text: "A. 举世通才（万物皆通，然手无缚鸡之力，武力为零）",
                action: () => {
                    gameState.skill = "A";
                    rollFamily();
                }
            },
            {
                text: "B. 百毒不侵（筋骨奇佳，身怀绝世武艺与强健体魄）",
                action: () => {
                    gameState.skill = "B";
                    rollFamily();
                }
            }
        ]
    );
}

function rollFamily() {
    const families = ["middleclass", "extremepoor"];
    gameState.family = families[Math.floor(Math.random() * families.length)];

    if (gameState.family === "middleclass") {
        gameState.money += 100;
        gameState.status += 10;
        renderScene(
            "【出身】：书香门第",
            `【家族底蕴】：初始家资银两：$${gameState.money}\n你投胎于书香门第与小康之家。母亲乃当地县塾秀才，父亲则是务农自给的平民百姓。`,
            [
                {
                    text: "继续成长",
                    action: () => {
                        if (gameState.skill === "A") {
                            middleClass();
                        } else {
                            diseaseImmunityMiddleClass();
                        }
                    }
                }
            ]
        );
    } else {
        gameState.money += 10;
        renderScene(
            "【出身】：寒门极贫",
            `【家族底蕴】：初始家资银两：$${gameState.money}\n你命途坎坷，降生于寒门极贫之家。母亲生你时难产离世，唯留父亲含辛茹苦将你拉扯成人。`,
            [
                {
                    text: "接受命运",
                    action: () => extremePoor()
                }
            ]
        );
    }
}

// ==================== 出身：中产阶级分支 ====================
function middleClass() {
    renderScene(
        "【求学岁月】",
        "十岁那年，母亲开始教你识字启蒙。学识 +10\n正当苦读之际，发小邀请你参加她家中举办的奢华诗酒茶会。",
        [
            {
                text: "赴约茶会 (accept)",
                action: () => {
                    gameState.money += 50;
                    gameState.knowledge -= 10;
                    renderScene(
                        "【荒废学业】",
                        "你玩乐了一整天，结交许多新友并赢了50文钱。因你屡屡逃课荒废学业，未能考入县学，五年里只能在乡间耕织。",
                        [
                            {
                                text: "命运抉择",
                                action: () => {
                                    if (Math.random() >= 0.4) {
                                        resistanceSection();
                                    } else {
                                        renderScene("【怅惘】", "你发觉自己虽有才学却对八股毫无兴趣。", [{ text: "转入商海", action: () => enterMerchantBranch() }]);
                                    }
                                }
                            }
                        ]
                    );
                }
            },
            {
                text: "拒绝赴约，闭门苦读 (refuse)",
                action: () => {
                    gameState.knowledge += 20;
                    renderScene(
                        "【乡试高中】",
                        "十五年后，你连克数关，成为乡里第一位举人！即将赴京参加殿试。",
                        [
                            { text: "迎接殿试御考", action: () => testMiddleclass() }
                        ]
                    );
                }
            }
        ]
    );
}

// 中产阶级 5道算数题测试
function testMiddleclass() {
    gameState.middleCorrect = 0;
    middleQ1();
}

function middleQ1() {
    renderScene("【殿试御考 · 第一题】", "算数试题：五加三，其和几何？", [
        { text: "A. 6", action: () => { alert("答错！"); middleQ2(); } },
        { text: "B. 8", action: () => { gameState.middleCorrect++; middleQ2(); } }
    ]);
}
function middleQ2() {
    renderScene("【殿试御考 · 第二题】", "算数试题：十减四，差为何？", [
        { text: "A. 6", action: () => { gameState.middleCorrect++; middleQ3(); } },
        { text: "B. 7", action: () => { alert("答错！"); middleQ3(); } }
    ]);
}
function middleQ3() {
    renderScene("【殿试御考 · 第三题】", "常理考校：一辰光阴之中，含多少分时刻？", [
        { text: "A. 60", action: () => { gameState.middleCorrect++; middleQ4(); } },
        { text: "B. 100", action: () => { alert("答错！"); middleQ4(); } }
    ]);
}
function middleQ4() {
    renderScene("【殿试御考 · 第四题】", "置业算术：原存苹果三枚，复购五枚，今共有几何？", [
        { text: "A. 8", action: () => { gameState.middleCorrect++; middleQ5(); } },
        { text: "B. 9", action: () => { alert("答错！"); middleQ5(); } }
    ]);
}
function middleQ5() {
    renderScene("【殿试御考 · 第五题】", "行程测算：马车一辰行六十里，两辰可驰几里？", [
        { text: "A. 100 里", action: () => { finishMiddleTest(); } },
        { text: "B. 120 里", action: () => { gameState.middleCorrect++; finishMiddleTest(); } }
    ]);
}

function finishMiddleTest() {
    gameState.knowledge += gameState.middleCorrect * 2;
    renderScene(
        "【御考结算】",
        `答对题数：${gameState.middleCorrect} / 5\n当前学识累加至：${gameState.knowledge}`,
        [
            {
                text: "查看殿试结果",
                action: () => {
                    if (gameState.knowledge < 58) {
                        renderScene("【无心仕途】", "你虽学识及格，却深感厌倦，决意弃文从商。", [{ text: "进入商海", action: () => enterMerchantBranch() }]);
                    } else {
                        gameState.money += 600;
                        gameState.status += 30;
                        gameState.knowledge += 40;
                        if (gameState.knowledge > 70 && gameState.status > 30) {
                            triggerEnding(1, "位极人臣！你御前拔得头筹，拜为当朝内阁首辅（宰相）！！！");
                        } else {
                            triggerEnding(2, "贺喜！凭藉绝顶聪明与家族扶持，你通过重重御考，登顶为当朝三品宰相！！！");
                        }
                    }
                }
            }
        ]
    );
}

// ==================== 出身：百毒不侵 + 中产分支 ====================
function diseaseImmunityMiddleClass() {
    gameState.status += 10;
    gameState.money += 100;
    renderScene(
        "【家学渊源】",
        "你 possess 家族期望的体魄与天赋，先生设下三道经义算理之题：",
        [{ text: "开始测试", action: () => testDiseaseImmunityQuestions() }]
    );
}

function testDiseaseImmunityQuestions() {
    gameState.diseaseCorrect = 0;
    disQ1();
}
function disQ1() {
    renderScene("【经义考校 · 一】", "算木之术：十二加八，其和几何？", [
        { text: "A. 20", action: () => { gameState.diseaseCorrect++; disQ2(); } },
        { text: "B. 22", action: () => { disQ2(); } }
    ]);
}
function disQ2() {
    renderScene("【经义考校 · 二】", "史册所载，我大明开国之初建都于何处？", [
        { text: "A. 应天府（南京）", action: () => { gameState.diseaseCorrect++; disQ3(); } },
        { text: "B. 顺天府（北京）", action: () => { disQ3(); } }
    ]);
}
function disQ3() {
    renderScene("【经义考校 · 三】", "儒家典籍之中，何者尊为《四书》之一？", [
        { text: "A. 《论语》", action: () => { gameState.diseaseCorrect++; finishDisTest(); } },
        { text: "B. 《道德经》", action: () => { finishDisTest(); } }
    ]);
}
function finishDisTest() {
    gameState.knowledge += gameState.diseaseCorrect * 7;
    renderScene("【测试结算】", `得分：${gameState.diseaseCorrect}/3，当前学识：${gameState.knowledge}`, [
        {
            text: "继续",
            action: () => {
                if (gameState.knowledge >= 20) {
                    scholarPrize();
                } else {
                    diseaseImmunityElderBranch();
                }
            }
        }
    ]);
}

function scholarPrize() {
    gameState.knowledge += 15;
    gameState.money += 50;
    gameState.status += 15;
    renderScene("【金榜初题】", "你虽非绝顶天资，然苦读终成秀才！即将参加殿试。", [{ text: "参加殿试", action: () => yearsOfStudyQuestions() }]);
}

function yearsOfStudyQuestions() {
    gameState.correct0 = 0;
    yQ1();
}
function yQ1() {
    renderScene("【殿试 · 1】Python输出文本指令？", "", [
        { text: "A. print()", action: () => { gameState.correct0++; yQ2(); } },
        { text: "B. input()", action: () => yQ2() }
    ]);
}
function yQ2() {
    renderScene("【殿试 · 2】法兰西国都城？", "", [
        { text: "A. 伦敦", action: () => yQ3() },
        { text: "B. 巴黎", action: () => { gameState.correct0++; yQ3(); } }
    ]);
}
function yQ3() {
    renderScene("【殿试 · 3】存储文字的数据类型？", "", [
        { text: "A. int", action: () => yQ4() },
        { text: "B. str", action: () => { gameState.correct0++; yQ4(); } }
    ]);
}
function yQ4() {
    renderScene("【殿试 · 4】何星宿称荧惑？", "", [
        { text: "A. 火星", action: () => { gameState.correct0++; finishYearsTest(); } },
        { text: "B. 金星", action: () => finishYearsTest() }
    ]);
}
function finishYearsTest() {
    gameState.knowledge += 4 * gameState.correct0;
    if (gameState.correct0 === 4) gameState.status += 15; else gameState.status += 5;
    
    if (gameState.health < 10) {
        triggerEnding(4, "因极度劳累且无钱医治，你的身躯彻底崩塌。");
    } else if (gameState.knowledge >= 65 && gameState.status >= 20 && gameState.health >= 50) {
        triggerEnding(1, "位极人臣！你御前拔得头筹，拜为当朝内阁首辅（宰相）！！！");
    } else {
        triggerEnding(2, "贺喜！凭藉绝顶聪明与家族扶持，你通过重重御考，登顶为当朝三品宰相！！！");
    }
}

// ==================== 出身：极贫分支 ====================
function extremePoor() {
    gameState.money += 10;
    if (gameState.skill === "B") {
        diseaseImmunityElderBranch();
    } else {
        marriageProposalNode();
    }
}

// 太医院长老奇遇分支
function diseaseImmunityElderBranch() {
    renderScene(
        "【太医院奇遇】",
        "太医院长老看中你天生异禀之体质，邀请你合伙采撷试炼珍稀奇毒药草。",
        [
            {
                text: "应允合作",
                action: () => {
                    gameState.health -= 50;
                    gameState.money += 60;
                    renderScene(
                        "【尝百草之毒】",
                        "意外吸入罕见草药剧毒！健康 -= 50，资产 += 60",
                        [
                            { text: "A. 归隐故里", action: () => resistanceSection() },
                            { 
                                text: "B. 咬牙坚持继续合作", 
                                action: () => {
                                    gameState.money += 300;
                                    gameState.health -= 30;
                                    triggerEnding(12, "尽管饱受病痛折磨，你仍咬牙坚持，终于掌握了世间奇毒与解药之绝密。");
                                } 
                            }
                        ]
                    );
                }
            },
            { text: "拒绝合作", action: () => resistanceSection() }
        ]
    );
}

// 婚姻求亲分支
function marriageProposalNode() {
    renderScene(
        "【红尘姻缘】",
        "封建礼教如锁链。及笄/弱冠之年，一位携着几卷残书与微薄聘礼的清贫书生登门求亲。你可愿许下此生誓言？",
        [
            {
                text: "accept (应许求亲)",
                action: () => {
                    gameState.health -= 10;
                    gameState.money -= 30;
                    const rand = Math.floor(Math.random() * 100) + 1;
                    if (rand <= 40 || gameState.knowledge > 60) {
                        gameState.money += 300;
                        gameState.status += 25;
                        gameState.health += 50;
                        triggerEnding(11, "红尘濡沫，患难见真情。你与挚爱相濡以沫，共度风雨，终得安稳充实之岁月！");
                    } else {
                        renderScene("【名落孙山】", "科场失利，家徒四壁。为求生路，你决定：", [
                            { text: "trade (下海经商)", action: () => enterMerchantBranch() },
                            { text: "stay (苟安于现状)", action: () => resistanceSection() }
                        ]);
                    }
                }
            },
            { text: "refuse (拒绝求亲)", action: () => resistanceSection() }
        ]
    );
}

// ==================== 商人分支 ====================
function enterMerchantBranch() {
    gameState.knowledge += 15;
    gameState.money += 200;
    gameState.status += 8;
    gameState.knowledge += 15;
    
    renderScene(
        "【商海纵横】",
        `你在设计与算术上天赋异禀，设计绝美江南丝绢引领风骚！资产 +$200，当前学识：${gameState.knowledge}`,
        [
            {
                text: "继续商道测试",
                action: () => {
                    if (gameState.knowledge >= 60) {
                        eliteMerchantQuiz();
                    } else {
                        ordinaryMerchantQuiz();
                    }
                }
            }
        ]
    );
}

function eliteMerchantQuiz() {
    renderScene("【精英富商测试】", "Q1: 绢丝成本50两，售出150两，每匹利润？\nA. 50\nB. 100\nC. 150", [
        { text: "选 A", action: () => eliteQuiz2(0) },
        { text: "选 B (正确)", action: () => eliteQuiz2(1) },
        { text: "选 C", action: () => eliteQuiz2(0) }
    ]);
}
function eliteQuiz2(score1) {
    renderScene("【精英富商测试】", "Q2: 投资本钱300两，获利50%，总本利？\nA. 350\nB. 400\nC. 450", [
        { text: "选 A", action: () => finishEliteQuiz(score1, 0) },
        { text: "选 B", action: () => finishEliteQuiz(score1, 0) },
        { text: "选 C (正确)", action: () => finishEliteQuiz(score1, 1) }
    ]);
}
function finishEliteQuiz(s1, s2) {
    let earned = (s1 + s2) * 200;
    gameState.money += earned;
    merchantHealthCrisis();
}

function ordinaryMerchantQuiz() {
    renderScene("【普通商人测试】", "Q1: 绢丝成本50两，售出150两，利润？\nA. 50\nB. 100\nC. 150", [
        { text: "选 B (正确)", action: () => ordQuiz2(1) },
        { text: "其他", action: () => ordQuiz2(0) }
    ]);
}
function ordQuiz2(s1) {
    renderScene("【普通商人测试】", "Q2: 投资300两，获利50%，总本利？\nA. 350\nB. 400\nC. 450", [
        { text: "选 C (正确)", action: () => finishOrdQuiz(s1, 1) },
        { text: "其他", action: () => finishOrdQuiz(s1, 0) }
    ]);
}
function finishOrdQuiz(s1, s2) {
    let earned = (s1 + s2) * 100;
    gameState.money += earned;
    merchantHealthCrisis();
}

function merchantHealthCrisis() {
    gameState.health -= 30;
    renderScene(
        "【沉屙积患】",
        `多年经商劳碌，健康急剧恶化！当前健康：${gameState.health}`,
        [
            {
                text: "A. 耗费巨资聘请御医诊治 ($200)",
                action: () => {
                    if (gameState.money >= 200) {
                        gameState.money -= 200;
                        gameState.health += 20;
                        gameState.status += 15;
                        triggerEnding(3, "积劳成疾后你幡然醒悟，于江南买下一处幽静别院，安享余生。");
                    } else {
                        alert("囊中羞涩，无法请医！病情恶化...");
                        pushThroughIllness();
                    }
                }
            },
            {
                text: "B. 带病拼搏扩展商海版图",
                action: () => pushThroughIllness()
            }
        ]
    );
}

function pushThroughIllness() {
    gameState.health -= 70;
    triggerEnding(4, "因极度劳累且无钱医治，你的身躯彻底崩塌。英年早逝于商途之上。");
}

// ==================== 乱世起义分支 ====================
function resistanceSection() {
    renderScene(
        "【乱世烽烟】",
        "朝廷苛政剥削，饥荒连年。一伙义军揭竿而起，邀请你加入起义军反抗暴政。可愿响应？",
        [
            {
                text: "yes (揭竿起义)",
                action: () => {
                    if (gameState.skill === "A" && gameState.knowledge < 60) {
                        dieA();
                    } else {
                        successB();
                    }
                }
            },
            {
                text: "refuse (拒绝)",
                action: () => {
                    if (gameState.skill === "B") {
                        refuseChoice();
                        newLeader();
                    } else {
                        enterMerchantBranch();
                    }
                }
            }
        ]
    );
}

function dieA() {
    renderScene("【溃败】", "你既无武艺又无谋略，所率兵马迅速被朝廷大军剿灭。", [
        { text: "A. 顽抗到底", action: () => triggerEnding(6, "于战场被捕，朝廷将你公审斩首示众。") },
        { 
            text: "B. 弃军逃跑", 
            action: () => {
                if (gameState.health >= 70 && gameState.knowledge >= 50 && gameState.status > 5) {
                    triggerEnding(5, "一路奔逃回乡，远离兵燹，三十余岁时因病平静离世。");
                } else {
                    triggerEnding(6, "逃跑途中被捕，斩首示众。");
                }
            } 
        }
    ]);
}

function successB() {
    gameState.status += 30;
    gameState.money += 1000;
    renderScene(
        "【破晓大胜】",
        "你体魄雄浑且具备卓越领袖才干，率起义军击溃朝廷大军，直取江山！",
        [
            {
                text: "yes (登基称帝)",
                action: () => {
                    gameState.money += 1000;
                    gameState.health += 70;
                    gameState.status += 20;
                    triggerEnding(8, "你推翻昏庸大明，攻占帝都，登基称帝，开创万里江山新纪元！");
                }
            },
            {
                text: "no (解甲归田)",
                action: () => triggerEnding(10, "挂印封金！你携万贯家财归隐山林，过上了逍遥快活的隐居岁月。")
            }
        ]
    );
}

function refuseChoice() {
    renderScene("【苍生哀叹】", "百姓依旧水深火热，此时一位乱世英雄崛起，欲改朝换代。你可愿追随他？", [
        { text: "追随新主", action: () => choiceAfterFollow() },
        { text: "拒绝追随", action: () => ordinaryEnding() }
    ]);
}

function newLeader() {
    choiceAfterFollow();
}

function choiceAfterFollow() {
    renderScene(
        "【功成身变】",
        "岁月流逝，昔日初心泯灭，新主建立起残酷铁腕统治。作为功臣你享尽荣华富贵，当如何抉择？",
        [
            { text: "A. 死谏劝诫", action: () => {
                gameState.money += 1000; gameState.health += 70; gameState.status += 20;
                triggerEnding(8, "你以死明志或强力匡正，开创新纪元！");
            }},
            { text: "B. 同流合污享乐", action: () => {
                gameState.money += 1000; gameState.health += 100; gameState.status += 20;
                triggerEnding(9, "纵使偶尔良心不安，你仍选择享受滔天权势与无尽财富。");
            }},
            { text: "C. 挂印离去", action: () => triggerEnding(10, "挂印归乡，逍遥余生。") }
        ]
    );
}

function ordinaryEnding() {
    gameState.money += 30;
    gameState.health += 10;
    triggerEnding(7, "你过着平凡安稳之日，远离战火，娶妻生子，终老于林泉。");
}

// ==================== 结局展示面板 ====================
function triggerEnding(endingNum, desc) {
    updateUI();
    renderScene(
        `【结局 ${endingNum}】`,
        `阁下 ${gameState.name}：\n\n${desc}\n\n====================\n【终局属性】\n❤️ 健康: ${gameState.health} | 💰 资产: $${gameState.money}\n👑 地位: ${gameState.status} | 📜 学识: ${gameState.knowledge}`,
        [
            {
                text: "重开新局（投胎转世）",
                action: () => startGame()
            }
        ]
    );
}

// 启动游戏
startGame();