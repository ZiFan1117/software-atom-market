# Federation 路 鑱旈偊鑱氬悎绾﹀畾锛坱opic 鑷姩鍙戠幇锛?
> 璁?atom 浣滆€?*涓嶆彁 PR 涔熻兘杩涘競鍦?*锛氬湪鑷繁鐨勪粨搴撻噷鏀?manifest锛屾墦涓婄害瀹?topic锛屾垜浠殑鍙戠幇鍣ㄤ細鑷姩鑱氬悎銆?> 杩欐槸"community 灞?锛堣嚜鍔ㄣ€乽nverified锛夛紱PR 杩涗腑澶粨鏄?verified 灞?锛堢瓥灞曪級銆備袱灞傚苟瀛橈紝瑙?docs/07 鍒嗗眰銆?
## 浣滆€呭弬涓庯紙涓夋锛岄浂 PR锛?
1. 鍦?*浣犺嚜宸辩殑浠撳簱**閲屾斁 manifest锛?   - 鍗曞師瀛愶細浠撳簱鏍圭洰褰曟斁 `atom.json`
   - 澶氬師瀛愶細浠撳簱閲屽缓 `atoms/` 鐩綍锛屾斁 `*.atom.json`
2. manifest 鎸?[`atom.schema.json`](./atom.schema.json) 鍐欙紙id/intent/input/output 蹇呭～锛沝escription 鍥涜妭瑙?[`detail-convention.md`](./detail-convention.md)锛?3. 缁欎粨搴撴墦 topic锛?*`software-atom`**

瀹屾垚銆傚彂鐜板櫒浼氬畾鏈熸悳绱?`topic:software-atom`锛屾媺鍙栧苟鏍￠獙浣犵殑 manifest锛岃仛鍚堣繘甯傚満鐩綍锛堟爣璁版潵婧愪粨搴撲笌 `unverified`锛夈€?
## 绾﹀畾缁嗗垯

| 椤?| 绾﹀畾 |
| --- | --- |
| 鑱氬悎 topic | `software-atom`锛堜粨搴撳繀椤诲叕寮€锛?|
| manifest 浣嶇疆 | 鏍圭洰褰?`atom.json`锛屾垨 `atoms/*.atom.json` |
| id 鍞竴鎬?| 鑱旈偊灞備笉鍋氬叏灞€鍘婚噸锛涘啿绐佹椂浠?`owner/repo` 闄愬畾鏄剧ず |
| 鏍￠獙 | 鍙戠幇鏃跺仛缁撴瀯鏍￠獙锛堝繀濉?鏋氫妇/褰㈢姸锛夛紱**涓嶈繍琛屽疄鐜?* |
| 淇′换鏍囪 | 鑱旈偊鑱氬悎涓€寰?`verified: false`锛涜 `verified` 璇疯蛋 PR 绛栧睍閫氶亾 |
| 鏇存柊 | 鍙戠幇鍣ㄦ寜璁″垝閲嶈窇锛涗綘 push 鏂扮増鏈紝甯傚満鐩綍闅忎箣鏇存柊 |

## 涓ゆ潯閫氶亾鎬庝箞閫?
| | community锛坱opic 鑷姩锛?| verified锛圥R 绛栧睍锛?|
| --- | --- | --- |
| 闂ㄦ | 鏈€浣庯紙鑷繁浠?+ topic锛?| 涓紙fork + PR + 璇勫锛?|
| 閫熷害 | 涓嬩竴娆″彂鐜板懆鏈熺敓鏁?| 浜哄伐璇勫鍚庣敓鏁?|
| 鏍囪 | `unverified` | 鍙?`verified` |
| 閫傚悎 | 涓汉鍘熷瓙銆佸疄楠屾€ц兘鍔涖€佸揩閫熷彂甯?| 楂橀澶嶇敤銆佽杩涢粯璁よ揣鏋剁殑鑳藉姏 |

## 瀹炵幇

- 鍙戠幇鍣細`scripts/discover.mjs`锛堟悳绱?`topic:software-atom` 鈫?鎷夊彇 manifest 鈫?缁撴瀯鏍￠獙 鈫?鍐?`registry/index.json`锛?- 杩愯锛歚npm run discover`锛堝缓璁厤 GitHub Actions 瀹氭椂璺戯紝鏈厤鍓嶆墜鍔?鏈湴鎵ц锛?
