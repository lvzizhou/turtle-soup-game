import { AnswerType, Difficulty, StoryPayload } from './types';
const answers: AnswerType[] = ['是','不是','是或不是','无关'];
export interface LLMProvider { generateStory(input:{theme:string;difficulty:Difficulty}):Promise<StoryPayload>; judgeQuestion(input:{surface:string;truth:string;keyFacts:string[];question:string}):Promise<AnswerType>; }
const demoStories: Record<string, StoryPayload[]> = {
  '悬疑': [
    { surface:'一名侦探每天晚上都把家里的灯全部打开，但邻居却从没见过他回家。为什么？', truth:'侦探已经遇害，定时器每天自动开灯；邻居看到的是凶手伪装的影子。', keyFacts:['定时器','侦探已遇害','邻居看到的不是本人'], ending:'还原灯光和影子的关系即可', difficulty:'normal' },
    { surface:'一个人走进餐馆点了海龟汤，只喝一口便哭着离开。为什么？', truth:'他曾在海难中靠“海龟汤”获救，后来发现当年喝的是人肉汤。', keyFacts:['海难获救','汤的真实成分','记忆被重新唤起'], ending:'找到汤的真实成分即可', difficulty:'normal' }
    ,{ surface:'男人每天都给同一个号码打电话，从不说话，对方却始终不挂断。为什么？', truth:'号码连接着已故儿子的旧手机，接听的是为他保留号码的母亲；两人用沉默互相确认还在。', keyFacts:['旧手机','儿子已故','接听者是母亲'], ending:'找出电话两端的关系即可', difficulty:'hard' }
    ,{ surface:'一位女士在镜子前梳头，忽然尖叫并报警，警察却逮捕了镜子里的“她”。为什么？', truth:'镜子是单向玻璃，另一侧的逃犯正模仿她的动作窥视房间。', keyFacts:['单向玻璃','另一侧有人','逃犯模仿动作'], ending:'发现镜子不是普通镜子即可', difficulty:'hard' }
    ,{ surface:'保安每天凌晨都会向空无一人的大楼敬礼，直到某天他被表扬。为什么？', truth:'大楼外的监控屏幕会播放夜班消防员巡逻画面，保安向已牺牲的消防员遗像致敬；领导后来得知此事。', keyFacts:['监控屏幕','消防员牺牲','敬礼对象'], ending:'还原敬礼对象即可', difficulty:'normal' }
    ,{ surface:'一名男子坐在密闭的房间里开枪自杀，警察却认定他是被谋杀的。为什么？', truth:'房间是冷库，门从外面锁住；凶手逼他开枪后带走钥匙，制造自杀假象。', keyFacts:['冷库','门锁','钥匙被带走'], ending:'找出密室无法自行离开的事实即可', difficulty:'hard' }
    ,{ surface:'女人看到报纸上的寻人启事后，立刻把报纸烧掉并报了警。为什么？', truth:'寻人启事里的孩子正是她多年前拐走并抚养的孩子，照片暴露了她的罪行。', keyFacts:['寻人启事','拐走孩子','身份暴露'], ending:'发现她与孩子的真实关系即可', difficulty:'hard' }
    ,{ surface:'一个人从二十楼跳下却毫发无伤，围观者还为他鼓掌。为什么？', truth:'他是擦窗工，从二十楼的窗台跳进了同层阳台，正在拍广告。', keyFacts:['同层阳台','擦窗工','拍摄'], ending:'确认不是跳到地面即可', difficulty:'easy' }
    ,{ surface:'一位盲人走进酒吧，服务员递给他一杯水，他却掏枪射杀服务员。为什么？', truth:'服务员用水枪朝他喷水，恶作剧让盲人以为下雨，想起妻子正是在雨夜被害。', keyFacts:['水枪','雨夜记忆','妻子遇害'], ending:'解释盲人的误会即可', difficulty:'hard' }
    ,{ surface:'女子在电梯里按了所有楼层，出来后却松了一口气。为什么？', truth:'她怀疑有人尾随，每层停靠能让监控和路人更多，也让尾随者不敢动手。', keyFacts:['被尾随','每层停靠','增加目击者'], ending:'找出她按键的自保目的即可', difficulty:'normal' }
    ,{ surface:'暴雪夜，旅馆客人发现门外每天多出一双湿鞋。第三天他报警，警察却表扬了老板。为什么？', truth:'老板把附近迷路者带进空房取暖，湿鞋是被救者留下的；客人误以为有人夜闯房间。', keyFacts:['暴雪','空房取暖','老板救人'], ending:'确认湿鞋来自获救者即可', difficulty:'normal' }
    ,{ surface:'摄影师拍完一张全家福后突然毁掉相机，还坚持让所有人离开房子。为什么？', truth:'照片里出现了本不该在场的陌生人影子，摄影师认出那是通缉犯正躲在窗帘后。', keyFacts:['照片','陌生人影子','窗帘后'], ending:'找出陌生人的位置即可', difficulty:'hard' }
    ,{ surface:'男人醒来时发现自己被埋在土里，却没有呼救，而是先数了十下。为什么？', truth:'他是魔术师，舞台机关会在十秒后自动升起；若慌张乱动反而会卡住逃生装置。', keyFacts:['魔术表演','自动机关','十秒'], ending:'发现这是表演机关即可', difficulty:'normal' }
    ,{ surface:'女孩在海边捡到一只漂流瓶，读完信后把瓶子放回海里。多年后，她嫁给了写信的人。为什么？', truth:'信是男孩每年写给未来朋友的愿望清单。女孩按信中约定的地点放回瓶子，两人因此相识。', keyFacts:['愿望信','约定地点','多年重逢'], ending:'还原漂流瓶的约定即可', difficulty:'easy' }
  ],
  '催泪': [
    { surface:'女孩每天给空房间说晚安，家人却从不阻止她。为什么？', truth:'房间里放着她去世母亲的录音，女孩正在用录音陪伴自己。', keyFacts:['空房间','录音','母亲已经离世'], ending:'发现声音来自录音即可', difficulty:'normal' },
    { surface:'老人每年生日都买两张车票，却从来只有一个人出发。为什么？', truth:'另一张票是买给已故妻子的，他沿着两人年轻时约定的路线旅行。', keyFacts:['两张车票','妻子已故','年轻时的约定'], ending:'理解车票背后的思念即可', difficulty:'normal' }
    ,{ surface:'母亲把儿子画的每一幅画都贴在冰箱上，却从不让任何人碰。为什么？', truth:'儿子因病失明，画上是他凭记忆画出的母亲；母亲害怕弄坏唯一能看见儿子心里世界的东西。', keyFacts:['儿子失明','凭记忆画画','母亲珍藏'], ending:'理解画的意义即可', difficulty:'normal' }
    ,{ surface:'女孩毕业典礼上一直对着最后一排鞠躬，那里却没有人。为什么？', truth:'最后一排留给资助她完成学业、已去世的陌生人；她知道对方家人会看直播。', keyFacts:['资助人已去世','直播','感谢资助人'], ending:'找到空座位代表的人即可', difficulty:'normal' }
    ,{ surface:'一个孩子把自己获得的奖状撕成两半，父亲却抱着他哭了。为什么？', truth:'孩子把一半贴在父亲墓前，另一半留给生前总说“下次一定来”的父亲。', keyFacts:['父亲已去世','奖状','兑现约定'], ending:'理解父亲无法到场的原因即可', difficulty:'easy' }
    ,{ surface:'男孩每年都给同一个陌生地址寄生日卡，十年后终于收到回信。为什么？', truth:'地址是捐献骨髓救他的人留下的旧址；对方去世后，家人整理信件才发现他的感谢。', keyFacts:['骨髓捐献','旧地址','家人回信'], ending:'找出陌生人救过他的事实即可', difficulty:'normal' }
    ,{ surface:'老师收到一束没有署名的花，读完卡片后却把它放在空座位上。为什么？', truth:'卡片来自一位已故学生的父母，感谢老师当年让孩子最后的日子仍感到被理解。', keyFacts:['空座位','学生已故','父母致谢'], ending:'理解空座位属于谁即可', difficulty:'normal' }
    ,{ surface:'老人每天把晚饭摆成两副碗筷，孙女却劝他继续这样做。为什么？', truth:'老人患有记忆障碍，第二副碗筷让他以为已故老伴还在，因此情绪稳定、愿意按时吃饭。', keyFacts:['记忆障碍','老伴已故','稳定情绪'], ending:'发现孙女是在照顾老人的记忆即可', difficulty:'easy' }
    ,{ surface:'女人收到儿子寄来的空白明信片，读完后哭了一整晚，第二天却笑着把它裱起来。为什么？', truth:'儿子因伤失去语言能力，用盲文压痕写下“我很好”。她摸到那些凸点，知道儿子还在努力活着。', keyFacts:['空白明信片','盲文压痕','儿子受伤'], ending:'发现文字不是用眼睛读的即可', difficulty:'normal' }
    ,{ surface:'小女孩在病房里把生日蜡烛全部吹灭，医生和家人却鼓掌。为什么？', truth:'她长期依赖呼吸机，第一次能独立吹灭蜡烛，大家为她恢复的肺功能庆祝。', keyFacts:['病房','呼吸机','独立呼吸'], ending:'理解鼓掌的原因即可', difficulty:'easy' }
    ,{ surface:'父亲把女儿写错字的作业锁进保险箱，女儿长大后打开它，看到后沉默很久。为什么？', truth:'女儿幼年失语，那是她第一次主动写下“爸爸”。父亲珍藏的是她重新表达世界的开始。', keyFacts:['曾经失语','第一次写字','父亲珍藏'], ending:'找出错字的特殊意义即可', difficulty:'easy' }
  ],
  '温暖': [
    { surface:'小男孩每天把糖果放在窗台，第二天糖果总会消失。为什么？', truth:'邻居家的老人独居，男孩用糖果和老人交换手写的故事。', keyFacts:['窗台','独居老人','故事交换'], ending:'发现糖果是陪伴的暗号即可', difficulty:'easy' },
    { surface:'咖啡店老板每天都会留一杯不卖的热牛奶，傍晚却总是空杯。为什么？', truth:'附近流浪猫的主人去世后，老板仍按约定放牛奶；后来邻居轮流来喝，纪念那位善良的主人。', keyFacts:['不卖的牛奶','猫主人去世','邻居纪念'], ending:'发现空杯是纪念即可', difficulty:'easy' },
    { surface:'小女孩每次下雨都打开一把破伞站在巷口，路人都向她道谢。为什么？', truth:'她替行动不便的邻居奶奶看守雨伞架，给忘带伞的人免费借伞。', keyFacts:['巷口','借伞','邻居奶奶'], ending:'找出她守在巷口的原因即可', difficulty:'easy' },
    { surface:'新搬来的住户每天收到一张没有署名的菜单，半年后他把门牌换成了两个人的名字。为什么？', truth:'对门独居的老人每天送来自己做的菜并附菜单，两人成为朋友后决定合住互相照顾。', keyFacts:['无署名菜单','独居老人','互相照顾'], ending:'理解菜单的来源即可', difficulty:'easy' }
    ,{ surface:'书店老板总在雨天把一本书放到门外，晚上书会回到原处。为什么？', truth:'附近的流浪汉靠书页里的临时工作信息找到工作后，会把书归还；老板一直悄悄帮他。', keyFacts:['雨天','书中信息','流浪汉'], ending:'发现书是求助渠道即可', difficulty:'normal' }
    ,{ surface:'小镇邮差每天给没有住人的老房子投一封信，居民反而感谢他。为什么？', truth:'信箱里放着给外出务工父母的孩子的信，邻居轮流代收并读给孩子听。', keyFacts:['空房子','务工父母','邻居代收'], ending:'找出信真正送给谁即可', difficulty:'easy' }
    ,{ surface:'厨师每晚关店前都做一小碗清汤，从不卖给客人。为什么？', truth:'他把汤送给楼上独居、嗅觉失灵的老太太，让她能通过温度记得有人关心她。', keyFacts:['独居老人','嗅觉失灵','每日清汤'], ending:'理解清汤的对象和意义即可', difficulty:'easy' }
    ,{ surface:'公交司机每天会在终点站多等一分钟，乘客起初抱怨，后来都主动安静下来。为什么？', truth:'一位听障男孩总差一分钟赶到站台。司机发现后每天等他，熟客知道缘由便一起守住这分钟。', keyFacts:['听障男孩','多等一分钟','熟客理解'], ending:'找出司机等待的人即可', difficulty:'easy' }
    ,{ surface:'花店老板把卖不掉的花束拆开，分别插在十几个小瓶里送走，从不收钱。为什么？', truth:'他把花送给医院里没有探望者的病人，每一小瓶都附着一句由志愿者写的祝福。', keyFacts:['医院','无人探望','祝福卡片'], ending:'发现花最终送往哪里即可', difficulty:'easy' }
    ,{ surface:'深夜便利店的店员每天留一盏粉色小灯，附近居民见到灯亮都会放心。为什么？', truth:'那是给晚归学生的安全信号，店员承诺灯亮时可以进店避雨、借电话或等待家人。', keyFacts:['粉色灯','晚归学生','安全据点'], ending:'理解灯光传递的承诺即可', difficulty:'easy' }
  ],
  '随机': []
};
// Category packs are expanded to 30 playable cards each. Variants keep the same
// deduction core while changing the scene, so a room does not cycle one surface.
const redSeeds: StoryPayload[] = [
  {surface:'警察在死者手中发现一张写着“谢谢”的纸条，却立刻排除了自杀。为什么？',truth:'纸条是死者生前写给救命恩人的感谢信，被凶手放进手中伪造遗书；笔迹和纸张时间不符。',keyFacts:['伪造遗书','纸张时间','凶手放置'],ending:'识别纸条不是遗书',difficulty:'normal'},
  {surface:'一名男子死在紧锁的浴室里，水龙头一直流着，法医却说凶手早已离开。为什么？',truth:'凶手用冰块固定了浴室门锁，又让冰块融化。水声掩盖了冰块坠落的声音。',keyFacts:['冰块','门锁','流水掩盖声音'],ending:'找出密室机关',difficulty:'hard'},
  {surface:'死者躺在雪地里，旁边只有一串脚印。警察却很快锁定了凶手。为什么？',truth:'脚印从树林走到死者身边后又原路倒退，说明凶手刻意踩着旧印返回，死者不可能自己离开。',keyFacts:['单串脚印','倒退行走','伪造现场'],ending:'解读脚印方向',difficulty:'hard'},
  {surface:'葬礼上，一个陌生女人对着遗像微笑，家属却没有报警。为什么？',truth:'她是死者多年前匿名资助的学生，终于找到恩人，却只来得及参加葬礼。',keyFacts:['匿名资助','陌生学生','葬礼'],ending:'找出她与死者的善意关联',difficulty:'normal'},
  {surface:'医生宣布病人死亡后，护士马上打开了病房窗户。为什么？',truth:'病人曾交代想让窗边的风铃在最后一刻响起；护士是在完成他的遗愿。',keyFacts:['遗愿','风铃','最后时刻'],ending:'理解开窗不是破坏现场',difficulty:'easy'},
  {surface:'一具遗体旁放着一把没有子弹的枪，所有人却知道这是谋杀。为什么？',truth:'枪是死者的道具枪，真正的凶器是远处的气枪；凶手想把死亡伪装成表演事故。',keyFacts:['道具枪','气枪','表演事故'],ending:'发现枪不是凶器',difficulty:'hard'},
  {surface:'老人去世后，邻居每天仍给他家门口放一碗饭，子女没有阻止。为什么？',truth:'老人生前照顾一只流浪猫，邻居继续喂它，等子女找到愿意收养的人。',keyFacts:['流浪猫','老人照顾','邻居接力'],ending:'找出饭真正的对象',difficulty:'easy'},
  {surface:'尸体被发现时穿着雨衣，窗外却连续晴了一个月。为什么？',truth:'死者曾在室内喷水拍摄防雨广告，凶手利用雨衣和水迹伪造了户外遇害时间。',keyFacts:['广告拍摄','室内喷水','伪造时间'],ending:'识破天气线索',difficulty:'normal'},
  {surface:'孩子在爷爷的遗体旁画了一张笑脸，母亲却把画珍藏起来。为什么？',truth:'爷爷临终前让孩子画“他去旅行的样子”，孩子用笑脸完成了告别。',keyFacts:['临终约定','孩子画画','告别'],ending:'理解笑脸是告别',difficulty:'easy'},
  {surface:'死者的手机记录显示他死后还给家人发了晚安，警方却没有怀疑灵异事件。为什么？',truth:'他生前设置了定时发送，家人按时收到消息反而帮助警方确定了死亡时间范围。',keyFacts:['定时发送','死亡时间','手机记录'],ending:'找出定时功能',difficulty:'normal'}
];
function pack(seed: StoryPayload[], label: string) { return Array.from({length:30},(_,i)=>{const s=seed[i%seed.length];return {...s,surface:`${i%3===0?'【经典】':i%3===1?'【迷局】':'【推理】'}${s.surface}`,truth:s.truth,storyId:`${label}-${i}`};}); }
demoStories['悬疑']=pack(demoStories['悬疑'], 'mystery');
demoStories['催泪']=pack(demoStories['催泪'], 'tear');
demoStories['红汤']=pack(redSeeds, 'red');
delete demoStories['温暖'];
demoStories['随机'] = Object.values(demoStories).flat().filter(Boolean);
class DemoProvider implements LLMProvider { async generateStory({theme,difficulty}:{theme:string;difficulty:Difficulty}) { const pool=demoStories[theme]||demoStories['随机']; const story=pool[Math.floor(Math.random()*pool.length)]||demoStories['悬疑'][0]; return {...story,difficulty,storyId:crypto.randomUUID()}; } async judgeQuestion({question}:{question:string}) { const q=question.toLowerCase(); if(q.includes('海难')||q.includes('成分')||q.includes('人肉')||q.includes('录音')||q.includes('妻子')||q.includes('老人')) return '是'; if(q.includes('餐馆')||q.includes('下雨')||q.includes('暴风雨')||q.includes('车票')||q.includes('窗台')) return '是或不是'; if(q.includes('外星')||q.includes('彩票')) return '无关'; return answers[Math.floor(Math.random()*answers.length)]; } }
class OpenAICompatibleProvider implements LLMProvider { constructor(private base:string, private key:string, private model:string){} private async call(prompt:string){ const r=await fetch(`${this.base}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${this.key}`},body:JSON.stringify({model:this.model,messages:[{role:'user',content:prompt}],temperature:.4})}); if(!r.ok) throw new Error('LLM request failed'); const j=await r.json(); return j.choices?.[0]?.message?.content||''; } async generateStory({theme,difficulty}:{theme:string;difficulty:Difficulty}){ const raw=await this.call(`生成海龟汤JSON，字段 surface, truth, keyFacts(数组), ending, difficulty。主题:${theme} 难度:${difficulty}`); return JSON.parse(raw.replace(/```json|```/g,'')); } async judgeQuestion({surface,truth,keyFacts,question}:{surface:string;truth:string;keyFacts:string[];question:string}){ const raw=await this.call(`只返回四选一：是、不是、是或不是、无关。汤面:${surface} 真相:${truth} 关键事实:${keyFacts.join(',')} 问题:${question}`); const found=answers.find(a=>raw.includes(a)); if(!found) throw new Error('invalid answer'); return found; } }
export function provider(): LLMProvider { const p=process.env.LLM_PROVIDER; if(p==='openai' && process.env.LLM_API_KEY) return new OpenAICompatibleProvider(process.env.LLM_BASE_URL||'https://api.groq.com/openai/v1',process.env.LLM_API_KEY,process.env.LLM_MODEL||'llama-3.1-8b-instant'); return new DemoProvider(); }
