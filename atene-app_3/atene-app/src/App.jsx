import React, { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import { ChevronLeft, ChevronRight, Plus, X, User, Phone, Trash2, Search, AlertTriangle, Users, ChevronDown, LogOut, Wifi, WifiOff, MessageCircle, BarChart3, Download } from "lucide-react";

// ============================================================
//  CONFIGURAZIONE SUPABASE
//  URL già inserito. Incolla SOLO la chiave qui sotto,
//  al posto di INCOLLA_QUI_LA_CHIAVE (tra le virgolette).
//  La chiave publishable/anon di Supabase è pensata per il browser.
// ============================================================
const SUPABASE_URL = "https://xzjwykabzxrjfwlhyhpn.supabase.co";
const SUPABASE_KEY = "sb_publishable_7erwA44JxXePWQbSe5O7Ow_5RwRmF4w";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Logo Atene Sport Village (incorporato, nessun file esterno necessario)
const LOGO_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAABeCAYAAACJpTD+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAFuESURBVHhedZ13vGRHdee/dbv75TfvTVQY5YhgkMgGCYloAwaTwQbv4oXF64TBZm0vNsmJXdbWGrDBYBuWNZgMtjBJJAkQAiGhhHKakWZG0uT4Yod79o86v7qne+R6n359b9Wpk8+pcEMn5l9j1DWQKCUBBiTL5zZUCcmPDT8GzJpjVG+5nhTwB5hYksM5yQJmBlXy7wpqMt4UgcRb1fCcAFqOz/sWORJUoSsp00gVTiB/Vc5PbQ1/OE/ShUnGpiofJ2dLsKoPNFNF0X1yfSJdOA6VgsvxFpn9W6dmLgdNewrH4iuWUdvlyoaeOU9J9gnylFPJIFxiiMYutetCeJK3VUF2M+exKCMbo/RJ2TbJ64sw4tdlrwzqABPVNXwyoj/VOU2gwmq15rbknXDGQ1MmFpQZaJSgSOrrzoYErxuHKfKLdsCRAsP4ce0wtcOnKhOPRpQyM2KwVq7Sh2A84Ux+nNx5MA8sP64t0xRqc1mQM+hbvOMGrrx/HYwtI/q3hfYU9FVkUsBKdskY8eF6jfyNBG6Bc5mtdrkCL5EnqxtbRXmLnkVH/KhC9nU46QWAQZNoKgWwcNeN2QpO4XFZSnAKb2HAeReOkADqQrxJQJFdo+E5opMiC81EdYywxnAGwzMqElrKVGNwltJXjhKOk2dr6hzlWMhqCoYmeoekSj4KCE8MQOowKohezGpeX/C6Y1ZeZwlaVXMuwaKB6n5jDHMHMytJKh/LSWoYOLxoynnEHz6SFb1Jdx6QOJ4hq8p4fmrev8A730XtIzYioEM207kSTkAlZyy684Zjkl/AoS8lBum/1GvkdFyRdyuEvb7OwVVIBxkhBLLrqQptEZ/64/aSvkk+wnkX2ZRgF//O3idh5FxFmY68CKsMNKK45M5exUh2QbAQsTYSgMIlJTizuELFE3WTgczpGY2gUogJ3nFHOClKtCqfArRbDq6M7Iov8g6czqCR15yWueJLGVGyDCldFSMkDyrnH4niMrtaCr5SbNiwRa7mtOhCQKM8iodiD4cv2Xk0GAVPkwBRIkoZPjoYrhsxFus1Kpeqath+4j+5jkanjcIbYcSjcEjfZcASr5XXBX8z98ek6bZ05nDuqxlVVEgUUI1FMI0GcgBXWFTkwHEkFwxXhEaW5PCV+rpzJocrQgWeEPN1wFNlgKS+ElRsB+dTRmy1clB02k4qGKGqQlCLuBSXskHdDsVBimGchrJsqoLDiyEFveAS2MCPvZ/Vnmkld3Dkoq9B0Ld4dJZlt6I3PxcLiHfJHvCXPhFePNQ+NZZ8ckof+ZNmG15SCtMqdzYLyQLRGpmiKQF7U4Zz/yjKd/wSumo19kjuQlEvGYnT0qm557tM5oGepB/3S5EotItSpQAhlxM4TGHYBS59/VuMFeULxvtJgDInDriH+qqPB0DJYq5sGUawVYQTLSnPP3I0aL4TzTRAspimVKprbCLUmQ9zJQ/yHDi1Mp46jEARp6upIEk0AVP4UWYl1yWXTXiSj3xCFnkcpSG0SSOk+jgshKlRTBDqHOCMJjGYy126hNFApfCi+mArHFfDuNc5vAVfKEHtFbWPSIPadez9hUYzEdEqLGkEDqNkSZLuZrWFwHfbYVTD806V1CivKMuPh4QPShZxTdciOuRQmourWtlF9OO8IKxPitKEWKOPn1eELC55KmiJt6AMaAJJipBiFSiSzYQvBE6ZMkgPTosarO/Bavkj2CRk0Ymj3Aoia+TAaeB84XKZO4bahpwtZM/oJCY4QgUZ3uQMo+0Rn+Cj82r6QtiAUVJoThsZxE/E5f4k/crO5gjqgYO6XqTL5CNV5Rkf1Yk53H+cL3N6Qx/pVPy4rBZwunz+pY4N/BDiJGVFo3sJ3bIwAWVRsJ+Yhtfo9FKQIy1Mh75DQ7loOq6W+o3MKwuw8yXliraMVhsMBu7Q7uDFYG7EgkNOEEcdJ6URQUM3zouSA05feIRL7FZeX3SDN8qJvcgfI5wJkY9qRWeFuWakKLhct0oCmqomp1n6kW1TRqKAU7quxYMC3OkZQXYdhkSrJOKqy7jCln/UP05DoibRCoFc+LNmmu8gQ8mnVAo0+I14TI3McRU4osCoD5+3iRkJrK4FsZgPgpV2Lb7laD4vVACmMNdWJzlTIhuy5VMPfVKCWuHe8vmpt6l/y8/bgvMFe4smUyVrRgOCwc2DtwSKdBBkN60jUhNkcW1kwXhmmR85kPSGVKYNBZqEFECo8KQQA8rpFgdq5Q5x2oEHgkpxpuBoSmC1r5OURHKH4SBKjkPrpyJ7wJOCbkz0a8cjxM5H5cfmDlvalCCcTtKsYUQ26bjILB8UHyGgpafSX3UhgZdkk0tVCERFmv9zv8olNY4nGHPGVY4ZumO7skPTlHEEZ4wNhWF9JYeJi0V3+Mrn6QMPNFM28k+l/tKBO1GKQ3o/KEt8eHKIyhQS6UiwMkYGDPPbkbbiWCGzl4/WQiMOqv4DLTDdDuojYAXpIwVYOYj8xyQkY2u73Xx0kw1l28ibn0fU8SB5IlMfcxslBYp3NMt0i/+pTTpSEgi0xUss0rWa1CeFC8lVlRONdJiUBEPSBs9IWbaqKGC0JDlZ4GXIILFOxQ1o9Ui2iNmDYYUXZr1dinDdNsWd2sL2qYZmzdk1T9WOR8szU9XKeCs8uw3c4WSLGBhKFiEQag+WAuLt9SM4kT5Stgk+tBHopuBkUQ84rwQdwbF6inwOEbCQUUO7nFMOpHpz3Yqe4YEuuICmjECjuIPjZQR5ZpEC35UcPjojnpBG+Cp0HXeJguAcZeTyOiO06zvAFhjVNSSogy9oBDSNJOK3MBmHnuA0BUanouDHxrBgJpniUOj/kmewQic4QhnBxJj6BSOmMDRrXaJS+XZvauXjQT9vTdd1/i4ZQ1MG72+DRob4HZ1UwWIeoPkkf6VoLI0KCmBlbIc3d5jRIj0N0Qx10h8M384x5Biq8qmX+DFCIDhMLdvoM0IvVzxyYBRnjlOqWFzgSGMoiPCdQeHSjpX3Ffnof4VPb9RsIo74xyTkuuHfJJ/5lMqDWPoRkM8eMaPKBx49YqYoR4rSB0ca4YIBkhNIuDHCTkxsK+h0/cQdWwpMPiyKZAoBZUF5ubLhpeVrEOG3OD2RY2raou1DPIuNOpwXCwYwXVgkyOXncmBzRSSGh3n1YSQRqU8JAC0YJZopxQW5guMltbtuSknBsX00FR/CUz5OLCYPySf4UgKfJci1s+R9Cv/qH3aeyrUh+cLohkugnzuEL9fb0LcFuaLMrhe1m8tpPiswC+uoqEeVhr8spZQr4aPxFIXimSh8dG5HIGNrWFdmLH2ljJCRI1wK9IU3RYWS4Yvhqvwpi3Wv7g8aJ1Wminir5CyMGBQpUUoNHxkwGr8Ywj+pAQNfqBLXGrUDOKMl6wU9SZeZiTB6K1CUqOSwDi9cRZ4wUtVKVDgBBbDO4w6Wy1YCnxH+vFLBgI/ItTUBi+zodEdp4f0Qr36evL3oWyiD/QQe78+KI4kFHpMjUBAmXeR1nRQYJWwhl3/gFxNlFCFGzimn80wceAInMqrYogQx5d8mBw8GlhPJIGKw1Dmc4UJEBkImq1p5eoWU68PwoG62RIuinYzRBL/qI+4SKI4LggIllwAcPjmuhsAwPekS6bJUjgCGkuQ4OB0lIelV8N6WQhvaMQyOWgIp1EWy6m+Nk+Rk4TLix4LF7aUT4TG/76rA6STyTLORUWRSkNHQq8S3ePZEU/gPwarEMDqq1rr4GRN+tHtQQtGZAbWnExkiZnnzrCfihSHBCUkkIgGCYQPtMlqUwBJMsUb4DtlcxM0VqWyQ8k27OQlIwcpgA9+O9vOkAHG5tPgvDLrMMRtKWcfwpzrpoake+kZdfKfI/DiFTFkcz0cw8RMvhFnUZ5Cp8O54Cx7Bx8QiuMCz+Cm4pDttKHh9Hftb8I/gI0qiSQlPdMW/+gUHx21Z8Hpd6etMSp6iNxpcxQe9Xx3WGdD0r2KiD7JJPuGN35a/my1gcyHEowQemi9KEa7QIUWIQBAmhcxWSSFycu8rAVQqBWH4qK8UVSVflPvHDOv3Mw8DDwBtl2qXQjtURVY3sNrFi2TAM7aKSbE0MpgHVclS6i8dNeANrkhLDsbIlDF59AtesApWGrihIHDDIvqi5TDRMXC7ZIDGVqqX3dSvgMoWgtNuYww2z/7qVGT3qfFoEkoBKKWGnlkzMowW+YG5zMIhXcs2sqMFGRSYRT4hFT/+bXma1nAQlYIYDFlfhGQo1eUTHTSlKMy/NIpIeCk4pcil9/NsU4Zxb2/JkMLtxtFNlfh3HZw/Gq7wLkWZK1F8ert4Lf38UwIhLj4dT3RKGUr86FhfBb/L42wIJPcRbyN6UluRbURHUmVJNMIdHGpoBFXAi6ZXD3yamoQg6j7yqMAVf45X830ir/o0pBtYPxZKGwlc8Z58mm1uTwWVeCfoQPh1LjpFD4G/pPNICzBNt4aECMBovpmBs6LikKdvV7p5nZgvMDFbyOCxPyFbeZueDxgKpnBeaeHpDlqCwrOz5EKjitNh4PC+3Sucj6TkIpMntKQ2lxeagJZcSYlFINJvCtMAyeYokAFD8jByPy38o33K1MHppaCXgtThR22r7yK7nwif6oqNvAjPMbaTI4eplAWdWqAhPCpKSqInfakysi25TBsEane7u5oymE5crwkPpEC/wAWbIdiGHOBbwBJCyowKKkjdMMShVIukwKA5bO7kmXCY6FB7bJChNe1oNDQsQMs3AYrhvF1X3MutMc6UeLc4/5QSPahESrjqfjCi44m6GJIz8ikcispgpFFZhwiHUmtDgybogzi5ix9IB3LIog8v0ZaRXclQjuWkwh+J+ke6GUI2+u2wpqm78IZ28UqgKTsQ/UWNflym/hrFxb+m4jRTS8PXZAR6NHwouEzB7X5fZgsNrCZnzcfSyIIvtGsIN/K9VnKEKow4FY0QxL13fUfniRlRc9Wm6/ACvfItP7/3iVHhAx1NJ0wjhtYdCpawXZls+KKSSlWFJOC4dCxA7cwkHYuZQCvixPsnwYQu4qvwFGQsCgkwQ4Lj5+rr/bRewj+yX4XrRTiFP4zCyByu8yScdbNjGEmbwyYZzOGlNw3Faq+8o4KopbuKXTZzNKILYVRQUPidFfKDZCGRJ8cV+Emib8cmb+FRpepJkl4fOUUwQlFaYKDABhjzDB6dKEvYOH8h5TAKkMJUqxEwLtTlbCJbVT5nduJag0BwoCJlA4c7jrM9lL1G4cz5TDROUsDEvx+bVDdiMK0DiM7iSHQupxYBgaGA8P4wHEQpZEDh05Sz3Cwqm0XmVS/aAX+xTVOV8QUeU0gepUgXys4j+BIj67hgA+nGfJQfKn7hVwGG9xN80bXqpD+XKW7di6ch3qQTxy05lLRTPk/MvrywWxRRdBAUq4hXvfCajyJF2SFClbkUvYRhsaDyYCvBohErBEvRkQdM7Z+kmPCMUZTldRp6G8adz1Bv1uxURT6LcAQlhuOYkVSK0oV3mDQWgs0cTnKpv2QpTuW38SvLm/NmuEMHJ0riwQ1YjO375OUWDvHuvKSQdAtzDqckdYwu3R8qTzal2ZEKTYXPAEbomfMyXOlIIi4vST5Ggx/pKfhU8VPZKIoU6kpxvgpOBZTLTSIx+wrLfDoDMRgKvkhYQ6/aCDtFTrDsSnnfAiemA/PRoOVbaw7HlfzGRTR9Mle874tH5ZlnqjoEdswiSYRT42Bqlw5KVCq1OW3zwI0OkzT98zrzKaal5jpN0h0FktW/bZA/g24TCJ0x0uQkTExh0+tgZt4/c9DuQLvtjx9XIaP79LG7BL1uHmV7PeiuwsIhWFqApSOwdBhWlqHbd8dOefRu6RGDZku9KUEuiR3bSoJyfSl5RRh9FT1L/67X7ICNE8dvdS4q9z6VgthHoITbSIHtOq8IvhB8otQ7/iGa8TjFkUQ9FW3OeClCpHN5cRC2Go3iMJeVYlLAmfy1P7mTH7uD6g0m+LBputUEX1M4XnU3N7opE4itIDh+njs4fOVTl2AIFYEWWPHozmHizQHNg9qcN6uh6uQ+dY9Ur2B1N7dPjcPUHKw/DTadBBtPhLUbYWyyITzoNmuqpJHAR+NWO/NYlX8N/7Ve4eO8485TdUhVIlFjvVVsaQEOH4CDh2H/Lti/Aw7vhR45cMz1FRymwek2KYnFZS7FmZG9SyKRH0mnUnL4rkI2d/ZJHhAKjIy0wSfccstij0YFmX+NHNKPJ0mtqc0TY7EzJGZebpIn81k03ZxrpIjO3mDyQxeA4GwirDox2pKCxZiU4J/KP3UIEC2MpR9lQs3DicFQNa+jGQQHz4T8PGT/Y4rXS6FFDI0AXlf7g2QmWKedauh7RqcPM9Ow4VQ48Qw4/jTYcHweFahz5mfgV4oraHUg+Ugx1s51/S4sL8LCUh4Zju7Ln8WDeYRYXoTuIvRWM82BdIGPhq67NJ7xVm1oj7n+29CehKlpmJ6C8ZlM49CBjM/crmZhxhDwx6m2YKKui869LgZFVL+5DxQfU73k8KKmUV80Ob3jEu2qET/byvWM85xa7uuSY2RWkPDpljCL/1jkuBaDBM9M4kXMSng5aQyGECgKHjldIjNehUDJRLJgfY9uXdtIKSzcxbOCQXLENYkLjGg5I1LmUBCJ31F5/V+l6ZnLU3v9YDXzV9UwvxFOOgfOfAxsPDlPkXrd5rbwMhrgco+5LvqwsAiHdsGu++GhrbD/AVg5nNuqCtrT2ak7UzAxBeNrYGISxjswPgWdycwvrgtNfft96K34twdwf+B892F1CVaX85RtdRV6gzxatTo+4rfzVKz4kDLufxAU+tYh5jYKiQYfIU0jhLNOyrqqfCYiHQufEKR4f5mS6ohtfF2R7TkamI6j4HEehc+PE7MvGw1BRzoiKJ59y7HXR6cuDhr6lP7mWVYM+GhR+juO5I5YO1ztt6cPrMnspguBCoowL5VO8HWL6gRgClLnp8zNxaO3lcCRGMo0IdvV3exkM9Nw9lPgjPNygFRVXg+kPMXJcrpuUic7xmAAh/fBrvvgoXvg4bthaX92xLFJmFgL0xtg/mQ44VSYmYH5DTA+nkcCXN96O6KmWCWZydi6RV72Mn9LZdgY0RSj3c7n/TqPIkcOwOH98PD9sGc7LB6A5WWwRKpaWDXuO5LB2cWX7GoajaOOvcgRrQ634agtHJek5HoUfkuZtnxl1F/R6B6SZ7Gj21+8I9bCSON8e5A0OHNxDsv8LQaCNxehI3w4VkXlDOgcn25Bw2jyZ7/VjitGgSGGTTs8CiRX8KgxhowVSJUDKTDyrWoZQvDNCJevURpWL2V+T90CT7wIJtdkp493I7daORMPBjDowYF9sHsr3H9rnvu3lkhjM9jURth4OqzbDJs253XKxGSmOQDqni/6XWYFr5w8Jq7aR+/aE0JRs8usqZHRBEuZJkoPmt7iuvLXJXXa+Z1lBiwuwPY74Y6fwv6dULchjflIo2zl9BB+7Wa5jWQHE+FoKwWBwyTxYi6f+C9MNwauNQX06sqn3GVaKJ05TyZcEY+OcwA1QULIkBFY8qijkCd3MoEjo4hBy0O0nFijBvrgARQDxIvRbCsOPMvJkEXpchatnYQiKGioz4gyI6wUbs5T2RVR9nV++ot53v6YS+CkM6B7JGf4sVmgQzU2Tl0P4OBe2HM/ade92IMPQGcJpk+ETWfDCWfA8SflPq2Un63v910G92olkaTduypP47Q2IIwK0rUxPAUiuZ2U0X1BPFS8X6Xk43BFl3lKm6gwBWW/705a56lY1YZ7b4Wbr4QDu/PI1ZpwX2o3+i4l2LmUELglcSV30ggfeJPceOAkmmSi6X/Jz2G385GKhZG3GNzPEyFIzBsSIQgKmkbRopNwREIa5Y+CmoezjO8CqV1X0uOORh2N758UFuEaYgkw4rswHRRegkXFFVv6OZ8WslBKzlc/z9NPOQse90yYmslz93YL+j1YXoWFA3DgQdh2B3AIxudh47lw8jlw0qkwOe/Ormli1TxanHQRzXlRIBi5rSQlfIu247Aa8Tx7m49YvW5ee6yuwOJRWFnIo1Gvlx3czEc7v1DX9hEiVb7FPJadf3IaJmegMwad8Uy31Q767zcjufDUfbjlRrjp29CroRpvfEDZesgUsme0U0zWoR/SlRK3t5fE0GqmjZoNqAg0K7WpR3WiLZ8NTZU9wnTLFJkhaxVh3GAaHVSSRgk5nxBKPt0GHhhJPtRrClFbTly6al/2tn2k0DA+pBzf3UpOyGiciogj0BVMHFmKLOpLzqL9VTj+dHjWy6GdfJHr2XTHHXDHDbB8GCbmYNOJcPZjYe0JMLMG+rqBwGW1QZgG1M1FQfGVUqYtfaRW5mG1C6uLsHgEDuyCg7vg4H5Y2A/9lbzI1pteqHxLO/konnKmr9oyRNABrrN+cES/cGnu/NbPGwbQjEpVGyZm83b1hs15nbR+E0zPwcQsqRpgaQyu+hr87BrfxVNxeZFNPFHFxXYZSbxOu5DF/XykV4WCwfyfOX6ZUSQr4VaC1RRMuqCxi5KnZduE6VYspVejzELNz5MrnYwInRYmlRE8aDTdEr7KOww5sblNXNja546mmBBOnx7EvkFv5USGoPa6sMgUUguOgyun24WpDjz7V2HdcdnQ42PZQX/8FdKBh7C5k2Dzab5I7+WRYvlIxj09m3ebOm3orIE1G2BsGqYm/QXdqcnYKeULfPt3w+4HYOd9ebG8tJ9Ur2Imx2+T2pMYPvLUYXcPd+pU+Zzd5ZBjazoivRZlhf7lcCRpCJdsZ7KdSgX9JUg9qtTHUgtL43nKVac8ginpEpKTUMgfYl1JYAqS4LQ4L8cUl0l6SfJBl6nyRDxka/mB9y2jeiBmcSQZUo4XBUKJLCHThb4C6N+KzkcIBuGvsiGTGdYKQhRnd8MIX2yXgBYyiEY2nF7RZODXUnP1G/FGg1+lBuqjcPKj4Hmvy3BVgluug1u+SeqvYDOnwqMvyFOpvnaU+tDp5LeyLK9AvZSvanfGYHwu70h1xqC7kneMHrwbdm+DQ4czrHXAxvKUBV94F0cPuijpMTXTDBdxqLrI57aSXkazctSDvkowhPNjSlRasIdwmuu5IsgR8fhxGfVH23UuvmTvmFDdt+poeyVW95M4yiTvW0kXxygrFPcXD9bE7EszJsmtiNeURUpFzEpAF67Ae30VjIJnadSszBYvKPrwVytQ5Li+q+KHJClbvIar5Mkzjnk2EKBkivwlGdFLYdWgdxQueQU8+in5At1PvwX3XgNj87D5PHjixXBwT+bn+BO9szuidrPGp/J0bOEA3Hdr3gXa8wDUqyQ6nmV9Q2MQ9Rf0Jh7Ng1R6kfEFZy6bxBMuocSTklTQKMTrIqyXUXvG+kfCgetO92fF/gItdTwCbvmIw/tg3zRLzmr4BtqUmguDxS/dh0w0CchEwzdlpJ/CivNX+quPkVjz0nzvljrE4JJiCkEaIRPOuCMvGSvAi1DSHNEZbWlK4M5dC681mWEQgoLAV1wPeZdcLz6iMaXMkYyRvF4jltUwWISX/RbMrYPv/xvsvB1OOBue/Aswd1yG6VSw7yFY7eWp1upqmT6lw/uxbbfAA3fAwh6ofRHcNZLVmHjRWiwRghwYuC6dpcZQUW4lFsn/SMDxPCSRAi+Z1ddLhEkcmyQjCelXKJICWYAWRoiQWJXJY38lWyEfmqGM8FhoiKZPu0VXI5cFnvSttkpx4/3LtD+QM18r13kE85FkSHo/jZoJytY2ZdBB019CaigMC/PkQ1zLI7922FpKJcMMfFogQSWYaYgMPCq4hpQitj0wygJZPPh5Svk9woNlWDcHL3wj3HIt3PFd2HQWXPQyWDPrGV0GGWQnHxuD3grpvlux26+DQztJdY21pvM0ctAipTqvJzT8F9adx+R6kopr50+CmT9cBk7fdanXhFYVyUdO094F5K1aDKoWyfEYslegYTTzfZ2Dv59LJzS6YmTqZJ61qxC46haDvSZveuhcjqtjKlJlWG15Gp6Sx0JWWEoZxsxyVQ2m/rivDPHbiFTkLQk20G6YbWyiGUbxo6TdrZcECskRC0k4N/MdF4cTLSSQjxamdldM5ccpGy4HiIJAO2UygK4LOG3nPysjfjuNch54liKsbiJZfcpo5pXdVTjzbDj3KfD9T+Ur3E9/FcxvynxXZDytFrTG83bqrVfD3dfD0tF835P5PVgYKeUHPTGysd2BqWqSZV6NgYttJAzze4cSKThAPs9PV7dd75bp6B4tBrlPyrBVVZFafVKq/SZGo6pa+T7RKjtgv1+zOpijn8aD7nUBsMoOmSqMcE+alGeEIFYpBsr46pqULPulHK7CaXiSKzeTGpWtUneX/LYj34Z2PDkhKcHk/tnN2q4jg/HJxqeK8weeLI5cfi5fTSahjp1pDOHDg8QYqswtIQOjdnf4QjUwVhbhOfqaNYu+nZnaj4sjuyPiffF5p45Hmc8HzVcK2TjW4/hKd+dJbYMVOO8p0FuEh2+Fi1+bp1fJs2S7RepMYN1VuPNauPUqWDpKsnZmd6Cffch3MrfrFc44bS2TY36LSDKgRUptWu02VbvN+MQ4tDtUrRbtKtEeH6NTDZjoTJJSh7FOAgaMd8YZJPjRj29mx64eq90eVb3CmSe1ePu7f4dzzziBdqtFC5cvJVJKVJ6Q5BdVBZW3kYy6Nj7wd1/lo5/4PnVrHOoBlfWZHV9m7doWMzNrWekldj58lNV6DCtzE9dJ8QXZQovzRKtlrJusOemUEzG3p9Fm9ehBtj+0hyWby/ADo9Uy1k7s4dX/5XW87uVPpt1uZ34N+maZbzPMUh7Y8KSSkif7xIGjy7zwRe+k25oJfqHi/EbbE/0kyqCkKhzu3x7IuWbmJX4XcFSAnCvUQU4L5bgcHDuv07kqoiMrwWvoNvK/skbxh2hKCaNIEcCFQ8HmAhUQx12HoDaawLc+bDoDFreTjjsNnv5ybHzaby1pZ9gH7iBdfzlp8QB1PZEv1KUq8BYUWbWYbR/kuh/9E+vmZ4oq8t0QKecEEpaSZ3/XTko+nci6Ssmo8+Oi1GZcd8N9vPo//S8OH+1y4ZNO5hMffRsnnriO8fFO7jtk+yynsBXtWR5VpIc//YvP8J6/+jz99iSz4wN+840v4Nde+0xmZiYZnxhneXmVd/7F/+VzX7iePmPN7CDhskenkn4Ts5PGu//4l3nda59ZAisB+/cf4sWveDf37FjFrEOyLpvXHeSyy/6es884kamZCZ9s5GlRnY3tepIfkkfi5FIa7Du4wEmnvpJue5MnWY06eUTO/WR3xyMfQ/7hMEMKizKSR7yCuABFLTcGzHN5P8a/Kn9QB+2D60XVEjA4qT5JTl4388msFx9pzOf/Gl28TdpBQjsfcU2DplulQ9PkzRjQmYD9d8GWZ2PPfDU2PgXtMVpH9sDX/y986p1wxaexg4eo+x1XQ+VTmD6p7xcV6YMNSNTMTvfZsG6WDRvm2bBhjg0b5tm0YY6NG+bYsG6O9evWsGHdLOvXzbJ+foZ1a2dYOzfN/NwM83PTzM9NsWZmmvnZKdb45+6te0gpsXZimUvf8xucesomJsc7VOR5u4XcY1F0LP95MjHArMYMeivLnp+MuSnjDa97Do8+71ROPeU4jts4zyknb+LP/uT1nHvaFFXqZttWSfOmhlBRaHbQsbGaR52ziQ3rZtm4fo6N69awfu0ss2umaaVV799lZgoufd+f8dhHn8bs7KS/utmnm1WiSlWeLqaMPzmv4EnBJWzZgEG3l/1Jvij/LL4Xrs/UkWfFsYJGvpWG11M+kjS/mUhDo1SUqPMPUUGhj37vIY/vzRRLxf29KFifWp+B/9qUL0pdEZmPgdON3sDwaFOrboROUiYKOK2G1SPw7NfAoy+E8el83eIz76W+7COkh7bDagdsnJTyhbzUW6Za3c9pGw7xn1/9NN7w+mfQSSsNX8D87BjJf2AnGzVPDxgir/M8+mVHbkQqBneYO+/YCqnNhvXjnLh5Ha2WjO6qGNQMBj0Ggz6DusbqGjPHWYNhWTVWYxgDjO5gGavyNGpycprxsbEhvlqp4pSTNvA37/99Ns318p3OtesUn0aaKzv5+rI22mZsPn4+7+LROOrCwjKHDh32ZF8zP3mUi556Nu1OnkclLI+dpml2HgaKTydtvnrg1/kzSFAPeg4k23vWQAqQz8oPGnsVPRfHGUkA5ZtwnYRoSEVYMDLaxcjKzPUKCtHx6ZhuIVH/bLEmSjVKEHjUcGm4UBpJvE+ZwkkAMePwWZpHKJpiCdcSvPhNcPJZpF0PYD/8POzf79csmqf9kuXbUMzg3LPW8df/842cd96pbFg3x4M79/LUS17LwuB4v/mw4vHnDLjim/+PufmZjCM189zMqbIjhe+spuzUZepUD6gt0a+N57/wrVx70y7OPqniW9/8IMdtWp9VnRKHDx3hxz+5i4d27aOua1qV0fN3H+cpFrQroz3WYTDIfHTGpvjg31/GdbfsgVTx9KecyOc+8Q6O3zTvHMmWxsLSKh/+6Jf5y/d8miO9KWfOfAYgp/M+dc3x832+e/lfc955Z+SmBGbGzbfey0WX/CbLdgI2WOVRJ49x403/zFinlWWujJWVPg89tJsDBw5ig7zOSa2KVjXwdVGmV5nR6yb6dZ8bb97J777lA9jUprDrJmWn7GOygXxPPpPwmZH7WLLmXD5Y/KkKQRKFHjKmnxTJnYnKp1by1Wy9zFQKaww8QJT5zXezMlUfBfyk8iuoVbxZzeEwH6HqcJNb7UGgdhlSQea3gGQGwFbgxb8NG06Bq74A227LN+LR8VgysB6pv8JxG41TTj2fG2+6lrf83uv5y7e/hrHxDpjRH9RcdMkbueHOwwwGeUdmtr3CxZc8id7KUagHWKqwVgezLqef2OZ973sXs7PTEgYz430f/ALf/MZP6K0uYa4fsy615Tt/b7nlQY70J7n4aafx+U+/m43rGme+/c77eckr3sb+I94vVVC3MCw/nuvrMS3Dsh9VLHf7dHs1yfq85mVb+PAH/5DZmclgct+CpebAwQXe9mcf4xOf+BE92r5NK4PLltknTt6wyne++UHOOfMkxwNgXHv93Vz49N9jML6OxCqPP2c9P/3JR4Jf1ezdd4hnP+f17D0ySyu186hIIqUKIz++nNw81DWWoNtLLCx2qfV4dPRNOY2cvTi8IynXQNRPMjlscTqfAjYO5JXxUw5jXWqGXH3k6EqVoqGtXrUrqjU9KmOqF3PGNfKoFMP4nneB939lhBrq1OBLQL0ML31Tvlnwc/8L7rke+skDxCDVVIMDnH/uFJ/55z/iW5f/PX/0R68kDVY5smdPZgFIKdGuWvzWb76KTsKDtOJob5JvXHkL3/nxVr7z4wf47jXbuOKH9/D9qx/k5lu20u83D4qZwWBgfPhDn+Q7P9rGlT/dx/dv2Mf3frqP719/iKtuWOCqG49wqD8D1Jxz3umMj40XE9XU/PDHt7LnwAoHF+DggnHoSM2hxS6HF/scWqg5vDTg8OKAQws1hxZqjiwOOLzUo9vr+zZrn1M3b2RyYlyCDakwkZifn+WP3/pazt+yMd/xXHWahZCRj+u8VpuZ7jA16feWCcSguzJgUOet/bFOi8c9cYubvXYkFasrPbY9sMjew/DwwR57Dg3Ye6jPnoM99h4csPdgzZ5DNXsP1+w9Yuw7YhxZNmo9qCX3qHTiJZ5H3zAJQDOa5PlgQNbMkHx+FAKilOTZPzSoPYVMLuJmfpuAAB1YllWQqJTjkeDSJwaiuK19fZK8v7KGWXMnaSnJnYF8A94LXg/3/Qy+/an8rLhNNKA2YON0jw994Hf56mXv5+Uvu5gt553G5d/4DvX4Jq69/lp6da/RazIuueSJjKUDgRcwS1jdwqoWZi3M2tQ2YGJqlkoXVQ3AOHp0mdXVReq6ynv/5psglT8mW+Vf6rJ6wBMuOJfxsZa0AMDtd2xjpeejqPQl5SV9al9H1M25j+6pqpmZX0u77dd2kPoyDiNRpcRJmzfwD3/7Vk49nnxvmggmTYEBBsxOTzA9PVHWYcmg16/Z8fABUrtNqhITnYrzLzjJsXvfvrG80Gdl2S8oFgfA+feLyTDchl8DEQvmdsC/y3nwF7dTRqERxNuS+7XQFzgLIwmOeMTPsrM5kiGGA0zlBBAzvjslZgvlhtSwcIpg1fkuFw6nkSe2x4BDAR2UIwUNVuBpL4L7boSfXQ0Df147+Vy3gnE7wBc+/ef8l//8AjafuIFWVXH/9r184YvfYmAT3HHXHnr9LKORv089eSOnnHoKVcef7xgygnipwZZYM398voaB9Jg4ePgoq72Owyi5BDxmeV+lv8IZJ69jrK03y0AisXfPIfp1x+2TfGoZrgOVBOd40Yifq6cnjM0nbQjweSdpMKipB4Oy+dBpV5x33im8972/y4bpw2UrtgRlqjFLzMyMMzU1IUp5StTtc/e9O2l1WuU6xwXnnkxLSTZBzwbs2H0Ya+vZ/BDkSASdO20RUUmZ/1wX+kUYEXT5Sxk9jwnbD5uRhBCVQYhM7BHadeNcrshfRiOcBKljwNjI8Cag+FGxZh1Dyv00cghuyKEaB8hwKV8POXML7LgT7r0tP18+wnfqHebX/+sLuOiixzDeyfPblOD9H/oXFrprsEGPbr/D5d+9gcHAn7cH2q3E69/wIjq23KixlEbDFTXnPPpcKj3W62Xx6CL9XphPx5GgoEm00oDJiQ5Vq7maXxscObgHW9kLKwdg5RCsHobeUn7GpL8M9Uo+7y3nazzSkeOdnh7nzNOPHzJdbcZ1N97NP37sX1lcWi0NE+Mdnv8LT+DNb34VU52u42rm8skS4xNr6HTyaOephF63z3U/3cqAFlifVr3A/NoZ36AGSPS7fa69cStjnR5VOgKskqwLtpqf3+mvQq+fH0fo9knWc19w+9fRjzQXl09kGtQ+6hD8c0jP3r9M5aWnOsvHmpfk9KYIkiMq0+bKMkyX48qzt5g1z5J1OHdd5hIX8I6nFAVEvM8pDIcBrNyTVc6F07NMwWuk2Tms1cnvksJvjUAJoCKlDhum9/GzGz7LcZvmC8p7tz7MUy/8Txxamsu3jViP173qfP7hw+9kYsxHDuDaG+7juc/7DY72NjbTQ2FJ+Rn1qj7Kx//pf/CqV1zI5Hie/9d1zY3X387P/9KfcnBJOj+2JKuYbu/him9/iCc98Tw3WCbzgx9cy67dR0jlViEwq+n3+66DvMtVtTp88cvX8NVv3kivzhsPVao5ZWPim9+4lLPPOMl/AClfkf/U56/kXe/8P1z6/nfzkuc/mZacy2D33kP8+m+9l69/515qxjIjVUUnrfLylz6Jz3z8jz3RZ9vv23eE57/kHdx828MMSGyeW+bKK/6es8442WfCif5Kjy997Uf89NpbGZ+aYHK8zdjYGGOdismJcao0RqvKt+j0BzVXfO9mvnjZT/K1LilDPpDIsrtz53pnXifFJ0vjcDveJtxUfhewKvO/XOKWa0rN1erShjMUM3lqrpgrSDTNkAOVHSlnzDSEOo7IQ3KBxXusQ4HrdFBgezGD2bVw9GDYmg6KSBWpd5BL//d/4/fe9HKq1MKspk6Jt/z+3/CRj13JAH/VT6o4/bgVfnbj55ieaqYFSys9znnUi9l1dB21fs+jYQDMSKv7+PGP/pEnnH8WnXZ26NoGfPs71/Lq1/0tR5b8ycBEGDmzHlLVYdPsLr57+T/x6HPP8OswudR1vFEi18s5c/e8tVwDf/fhL/P2d3+Mlf50VputcMG5G/jKv72XzSdudPXn/P7BD1/GH77tY5x95lq+9Ln/yTlnn1xoDgY1d96zg1e88o+5Z3uW1aqKybFV3vKmF/I/3/lrfmNlxrdr136e+7zf4fbtmakzNq5y9dWf5LiNa5obGTG6vT6rqz1SlTdFUiLfB1dmxBXmcFdeczcvfuEfYGMbXMd1407IP4JeYsBkjh1WvqDASSF5Bz/R+j8qugmIcA65U/IRBHfQsjZwQtrN0nmlOh/HzLkv/XyoLNtxDE87hgLEDxRUUUBG+MTxLRwuIhYHLMqqOe+stbzx9S+C5NdUreKee3bwqU/+O3VZ2OchfccDBzh8ZDmP7o5oYqzNK171Qtptfx9VKWIqj0IbN8zR8mleVk/i9jt2MFBQm4/KEr3wXDM7NcnM9CRWpgkZRvdklYWy56NUJapWXnRXVaKVEocOLOatalx/VJx88kampiYatZF33BaOHKY7GOOeHQPe+ocfZPfug6W9alWcdeaJXPrXv8e6NUcxT4iTYx2ecMHZ0CzHgcTSSpfFhaV8Rb02JsZbzM02280JSCkx3mkzOzPFzNQEE5NjjI93GB9r0Wm3GWu3aLeSf2Df3sO0Ov5Ep5i3gq1Qz/XBZ0oyV738KHbTgRszua4bQsG5lNmyFOHjOMzngtmz/KNA8Lrkzo+ymzwgfkQjCuCc+WkBMiEXrvBdhIwB5A3J63GevKnq7uVtf/JGZmbCjkyVeN/7/4WjqzOOughM3ZrkX//tKgb9vC4xz3YveP6FjNV7/FnwEdmq/FDieCerOdfmac0NN91H34K+CTr3gKkSTIzNMj4+7mZ6BHkzN+BX79EVdwElWFpcZGCe4CrDrOasM49nqoyKuXS7fR7afZCqlej2jB9c8wAf+NAXOLqwXNQ31unwjKdv4S1v/mWmO6uQurRbA04/eVNkDICFhRUOHe1DapEqo9NqMT6u6aEjxLLJU77LV65XbBfsUPeNm356H1a1facz/Hip9C7fM9XhPuGJSJcjyLoa1WU+DDOh4Z+D8xFEsMkX50kpqkA2zBTg+C1mA3gp8hT/LrtWEfkjdEwh6pvK5jDyYi4kqRmpJDC5PjHgaU89l1e+9Jn5Sri3XHfDnXz2C9+irqZcr1V+GwktrDXDNT/6MYM6B0M2pvFzT3oU4+3aYZUQxGHNhg0TdMrzFHnzs9WC2269l15XGwEyogTyhDPoMTU3n0cq0x1ExvJyl633P8ztd27njjt3cNfdO7jn7p3ce9+D3Lf1Qbb65957d3DDzffy05vvxsyvcdQVVb3K/JpZxjotZyuH1OLSCvdt210S1cJyzUf/39f5+jeuyZsW7gZr1kzxxte9kKc+7TSq1oBOq2Z6ZnLER2pWVlZZXMoXBquqxdSGzflWn0SRudsbsHfvYbZv38v99+9l2wO72Hb/bu7fvosHHtjN/Tv3cv+OPWzfsY8HduzhxuuvpbaxrOSa7BfS26jTm9xERlEiCowW3ynKz0UgyUjMvcxv1FeL9p+1rx8R+zk0cz2LkSlaoU6lnKfGCaxI0ZR4KnxFqaoUX5bTtcXnBjygahteo5B8GlMxZjv42lc/xHOf8bgy8lgNb/jNt/O1b1wNNpWf10jQqiqqqqLV7nDBo4/nc599PxMTE4WPuq553Rv/ki9edivdEvSZhwQ8/hz49uUfZe26ucKH1TVnnftStu3tNA+xFbndBkCr7vPa117IB/73bzK/ZgZSwqzmge0P88pX/gG79/VJVc7SyfL0KlX54l4CBoOK5W6Pwys1K6vZOasEHY7y3j//NX7vTa8qdjUzduzcwy+84A+4e+ey3wFQUSXjvNMS//bFv+ass04Gy3cr93s1t9y5lZe//M1MTIzzrcs/ykmb15cJV29Q8/0f3MTPv+id0JlhYrzi1S95Eh//h7fmaWLWOvv2HuTFL/0tFlbHGfQGDOqKxMBH90TVyrfRJzMGdeLBXUssdP2OjOK38j+/dV++FgOIGDSxWO6XQqO5D2XC2lgXUh814mJbjBjNWkJrhRIcyqDCFa5jqF+ZUxeuvXi2V4k4UWaQ44zi8Po4XSsBFKda/m1Gqru84hXP5RlPf2xQcsbzX9/waj7zyUv5/Kffw+c/87/44mffy799/lIu++Jf85V//T/81V/9MZ2xfG2iGNrgNa/8ecbSQU8cQe7amFmzkVY7qznr3VjtDRgMVpxPB44B5rLU1uOxW86gMzbmLOZHgW+7ayfbd/V56ICxc3+PHXv7bN/b5/7dfe7f1WXbri5bd3d5YM8quw/VrKxKFwmzxMR4m03Hr3dOG685cnSZ5ZWVXOe6qa3i3p0D/vsfvo99ew9lQEu02xWPOvsU/uzP38x556xl/bpZnz1lO/V6A+69d6ffD9en3TIu2HKam9RtabC4tMp1P93ObfetcucDfe5+sMvdO/vctbPLXTt63LFtyT8r3L2jy0LXmU3ZgTM9l6ERJRfpU2XIl0tlcaPGHk0TzQoxVA5lX3LvlLIz145ICGvtU9M4SFlsS4BwjUSOL7wExrFjb2pUGQqwIQkF4F+qT/6xYQVWidmJw7zj7b9OW9dLHF1KiYueej7PesYTecbTH8czL3o8T7/wAp7y5MfwxCecx2O3nMm555xKSy9289KqKp74hEcx1vJ3/wakKfWZmV1DIu/Y4Dc5Hl1YykESgzupn44TNljmMedsZnzMb7xMeeC57a5trPaTm89H/arRpRlYrQeUPIn4035GzeTUGKeecmKzbvHywPZdLCz3wmMRuax2E9+/eisf+vAXWFhaKdc5JsY7vPgFF/H7b30TkxNjDSKD7mqX627aTtUZy0FV11yw5QwHSD6lg5VVqJnOd/cCUPndCi2/nzpf+C35nOSJ1W0sNlOY1WgTpNg/+s+IrlWK6UKg+HFVtnMVG26gJhMzTCxb4NjvWEpAqKuGrgA/MoBkWBe8nDuuoQ0AzdYijUCrAPlH8lhNVR/it3/n1Tzq7M3gU4wM5QayRIU/Z50SCd+GLJOIGLxZPynBpk1zXPyMp+ct3iTjJZL1OOvsM6jarbIWTBiHjyzS7UsOZe2Q0by0Us2amSna5Vl3SNbijtu2011ddWDpLDu2SfSyeNW7c/PqK5kx1Ukcv3FNuegntT344G4WF/MNhAWRGaSKI91xPvLxy/nhNXdQe2JMfn/XxRc+oXkswPH1ez1uv+XWfKMl0Eo91q7LW9Cyy2BQs3PXIVJnIneqfZ3KI4ysKW84NAGQ7VWUFvnVdF5Ii1JGPgW/wxS5w3Te8n3II0ZyDorMnoXqQMwcrnx0Ls+Xc4ohtRME8KumtbcLjoC3jAwqEXc4R3yLPx17RqwgpTYnHd/m93/3Nfk2eO9uDKjrmtpq6kHeeapdlLq23FbXDGzAYFD7sxmNmkh5V+xXX/uc/IxJrR0Xw2yVSy55PK12u+i+tsSRIwsM+tpZikZ0pvxrZiYxM5vhkstd17Bv9x76PfI1CV87VqnyZxrzPV/51httSuQnKrNK+6ydn2JifCxs2OYkcfjgQbr9oEfp2u2w/3CLd/zJpTyw/aFh3StAdNsOiUE94Ojhg/l2FDParW7epXOKYKyu9rj62luxlr9tEvKOlWYntf+rafyvrhvfKey7b5VATd7ZAt7Rkpx/JfAYfC6b482ruSQCch4BPMJUyQKS+FGADI0QfhCJiqnSrk84T7phMcAVrwxwOmwQ5pJGaBq0+wd417t+g43r84UsZb7duw5x+bev5euXX8VXL7+ar1x+NV/5xlV8+avf49+//n3+9cvf50uXXckX//V7fO6L3+FfPvNttm7dyWAwaNRA4vEXnMd4OuDEs4x1H7acs5m2binxsrCwygD/RSvfSWpEanSxfq7N/Fy+vV5To4ENmJ1qcdLxiVM2rXLSpiVO2bjMSRuW2bxxmRM2LnLC+kU2zS9y3PwKm9YuMze1QIcFsB6WjFNP38Tk1GQz3TLodnscOLiQt1cLD8OO1B/Abfcu8D/+5O85eOjosGOFHmCsLHdZXl72X2k2WhXlYmrxs2Rs2/owHVumqo9S9Y+QVhfyewe6C9BfyC++GCzk22zqVRI9Z0vOHRgoftrYpTAY/bh0caUXf5H5hoVKrH95SM0+zIxKPoTYo1pzwNguYomMo0RxaFcp8H6eyr8GhxxIpSjHMn1tu2pnIuJMlLe7pARPfswMV3znH5maHC9AVhuv/U9/zBXfv4069XNWJlHX/Tw1STkj5hGpJlUdrO7z7EsezT9//D1MTU36rCYxGPR54lNfz21bVxj08+5M1X2YB+79MieeuKHwUdfwqc9fwe+85R84uuRbwEUvUckVjzmtz3e//U8cd9z6PBKQR7aHHzzAwtIi3W6fmpoqJQZ1Tb+fR8Vev0evl3fsaowDBxb4znev418+cxUrPeMP3vRc/uxPf5uJsXbOjWYcPLTAb7zpr/jC1+9oHNBS1m0KwVzXzE31edsfvpI3/84rh/SZ2c983nr7Np71nF9n/2J+AcSJa7tcecVHOOesE12+RL/fZ9fuw3z+S1fQXe1TVcag28eoyU/7G2YDrDLqgTEYwMN7D/ONr1/Pzr34+lk6C85urmyd43JYmNIm7xO+XBm5Ub4NJNa9PG8By/EYjcb4LQZC0ARkQwEmpoS3MBaZ8j5lmIwCDDPaFIeV8MXJFJzClfJFLBLj7OHyr72PSy56QsBdc91NW7n44l+jywa/JuSvXx1VVMrwqd0mARtnDnDnbZcxNzebmx3sAx/8HG/78y+yspIfQ94wtZ9bb/4SmzauL0ZLGO/8i3/mb/7u6yytWB6By2ZJkDclTlm/zPeu+EdOO/WErKoinaY1tcvpHGuxbpD0xKPb9mOf/BZv/aN/YHGxx1+865W87Q9+LbOUslM/9NB+XvyKd3LD7fuCDp0fcx2QPNL7HL+ux8c/+g5+/tlP9Pu7so0lwTXX3sYzn/O7dKv1UMPGuS5XfOt9PObRp7qeG3lcCmfcf+bBE590O6izPAtLK3ziS9fw1jf/DXVrTZ6emRthyBeTbwSFRKqgkjxmTj1sVknRwS9zqzkBcwTma4Xap0+ENlTnRXyZOnqlslFsi46tvgogAUcmVSc8aQQuWTP3xPtoigjQT1T1Ki992SVcfFG+JlLMb8all/5femlt46S+kB9ykqRPwgY11jf27Fvmzvv20++Ll+w8T33aBUywL8/1bcCJx83T7mhtkOfmBtx+x70MbKyZW4tWwZV52H2wz9XX3sXKas+XblJ81k2eNuZnMxJ57VXpGrBeMeRl+7YdrKyuMjY+YO38unItxdwu3W6Xw4cON34QlZ5kD18PVIm9h9q84+0fYOfOXQ7p7QmgZmW1S7dXZRerjNV6jK9+7WpWe9mPhF3feMAmfwld8keQ8ZVTq8p3Xo+PtVk3rw0Aly95gozJtpyPJE+tgctmk8NEHyp9cl1VHEsdi5MJMKxLCrIQVLljY0DVmbJB1ASNovFILSglYMQpBYzgSerklTEwpAzLK66pscO8/X+8oThqjfnreu7iy/9+tf88m2fIwozTqLzeHK/lqUBqz/KZz36FQa/vZDPOR593OhNjLWhlp12/YY52K788LU+V8htM7r5rG/2eX48Ad65hw2ADuv1J3v62S7nyBz/j8NElbJCoy6sx9MKHVMxGnfnIdMAsv1BhUMORI4fp91tMT05w2imbmhzmcMsrq3RXl1x2Z0sAiLdSyYCK2+5d5E/e9XEOH1mk9vdkmRl9s3wrS9uvjJNYWIEPfvBz/OSaO1he0QscNGpnX8qY5Y8eTK47I6up36+5/77tJGuRClyIOsx9ti6sg2IhyhFnICO+F0fNZCTWhhdB4IiGamS00F6+M5KGUQ1tcjiV5IER6i0wg9Mskf9IUy0JRQPvh0PtxakhWcVzn3kmH/ng73lTdpqV1R5vfvN7uOJHuzD0jIkULh4DL0N0arA2F//cGv7xQ+9iYmLcjZgd+KWv+FNu33YI661y5gkV73rXr3PCCetptVpUrURNm9f88tvZc3S84Vf0Cg0d5OnfxvlVnvfcJ/HYLWeybmN+mnB1tU+/V2d/SvltXVmCRH91lV63R7/Xp/bM+e9f/SHX3XKA2SnjV191EZtPWu/31uYr9Pfc9zBf+vJ1HF31Oy1GbQL+0gvnz/LX/KTx+295Ec959pOYGG8zMT7OwGo+9onv8Ld//43m9x1JtFotNs0c5bd/86X8wvMvZt3sZH4gizwa5leZ5ilRTaKyHPSlmLG8OuBt7/okX7v8hvxWzThvK7Di15pZQhCjsWvwo9oDqNy50ZQmSKz8c4cvlBvouJCOzIvRsgaJTLuTqauCSPRKoIT7n6AslosCILSLBwWpA1g0ah6mZ6cGbJjPO0m5yejXPR7YuZB/O6QEr0oIRvOgKfQdt1VMjddsnKvotFvZkKlFalU89PASK33noO4zPVUzMV5RtdpAj36/xZGjg/zit5S3ZrNuioKOoZWAVHep0gqdsQ6p8tHCR4zGRHmtkt8Ua/nRYDFf+U+3pZo06PptJ/38qlbpsPIfPYVm9Ha8w0Vt+VeQJ8b6zM22abeq/OxH3eLIYpcjy2GtlVJZI3ZYZt2cMTk+WYJC64eU8uQmy+71ZnnSA9R1zf5DLRZW/BGDKtxv6HYPFU0p1e6jlXzVv4f8dljexNqXZQ9XJCHncEJiOGXw0k5qhrTSJMMGph6R51jpQCk7xFAR40PInIcUor/AN825DAvbFMlB4wyFzggPpYwEjHjxkTTvxIwwowQgQyRfzz1idpMOwvmo4pL4CzoegnF6uF4ya82xgsEcVjwNFQVt1G1ITqorwe044+ZDHt6cX03X/b4qaPgcZV0+C42cSb5ZCDcdhniMPIdK+XKkbTTEMlCo02xIOktUzYTWkUkZ3qcUCwTRcWgvQDqMOByn6gqchAo0Y7umchHeLCu+1v1ggZ9jGQr93TCNlRunaSwzTEv0juFbaJpzw6cp0Wje0qz5VDVyjss6ZHSHKfxL32HNOMrfkO0CcvN/FuotBMiQ7iI+gveO4gvrQNNtL+5HRD3oXPSVubUOc9qW4TLGEXpF1yM0ow1Gz1V0L6K57QucF9liyG5+knK7L9xx5M5sLaZV531N9bVPjyLOwGwUZrQURQre/2m6UWioeL3gE57FVB+YKILqQO1+XkSK07ggq1n4AdARPo/h1zxY/b1QBV4lyiLcAacFZ9ex6VgO9x8kL5TpQp0F46u61EW+vMQElKRPhs8TDQ9DfUdsnpoRFYsmUz8FvJeid+FWe9SJv9HTgj2iLov8jivaWDDlo4bRAIn6ibj82NsTa16cH44wJ1QIhzLEzEgRA5paRMMNcTQK6+clmxH2sZV5HE5ZKAPlT1G0nk9QG8FKtf/AZi//HFvlP9xp7twr+YEgzKBVw+RU5iHh27VtWF0g9QzTtQDIc/l2B9oT+Yd9Vvv5CjGdBp9Z/unnsTEYy2+TB4PuMiwukVJ+gwgVMLM2c932nz3Q21OqcThyEOJWs2SzunmNktYeYs/M98AAvyhq+RcempeIJ/IPEA364WV/3iXareVrw77/RnwEkak1rVJ9yq8KGgo++VcC6MHENMl/itsAFhf9SU4f2FOXNL4GxvzXgUmwvIotHvG1k4/+Q/iLACPyhBLhk/rRdFC/pFEnkVjzS37VyWGHOomQjBTbIxNBAXKQlIbnsg2CYwVI5Z8Xx8dI0A4FosMN9XWjFPr9HAznPAEe9XOwZj5fyErkTcWvfwL27cu3Pzzzl+G0s/PNdgxgYFg9IO1/GPvOp2GQfxTHWgnOeTyc80TS/Kb8Xt3lBdh5F1z7bVI3v3eXfhe2PAUe9yzSxJTfWFvln4q77ybSj/4dG3Rgw0b4pTeS2mM+8g/y7y8m3+K88kvYPbd6li2ayK9KesJz4KQz4TufhpVenlbUBmum4EnPh9t+CLsegulpeMEb8nvHbro649p8Jlz8Yrj+SrjnJv/paxW34cQEPPfVcGAf/PAr7pwBDE9SlWW+pyZJz3oNtrII3/4E2Hizja7rE52UfyDplLPyFnEi/4T2tz4DO3d6YPXhwl+EM7aQxqfdjQyO7id98lJsYvqYwamZzrlPHBM8cR0oH0we3CO+J59yN2yeJzFla8GOrFUE53iGnV/1EcaznShlrhw+ZLMhpaufMxgDJDc2i3X1i2zoHOFpwwmnkn7hP8PGE0m9FVg+CkuLpHpAavvVNxvAY55CWrOB9PBW2L0D2/MAqd2GM8+HMy4AqzHrw4UvJj3rV0hr1pP27yDt2UYan4TzLyE991cx8zex04NznwhTa0j7H4KHt5J2bYXOGOmxl+Sffkg1LB4lPXQ/9uA9cHRvHnl2PwjbbiPtuBvbt/NY4eR0m88gnbEFjjvRp34JrAs/94tw3pNIs2sz7MaTScefnH8VWM60+XTYuBmmpkc2JMIUaH4dnHwuae2mfA9WHEmgsenA8ojzzF/BNp8OpzwKTjjDH7FVgFjG8dLfgbMek38Q6eFt8PBW2H4fHDnsGGs4/2mw5cKcsPY/CPt2kvY9BHfegLXbw8uBRPCxUX8K/jbkl7HJfW2oCD4ja9E5+09LfXE8IaRZ3JZyDMZcTONkAFc0q6QyljoeZfzAdRrpF1GMoGuIycgSwnHWPdL5z8i/lPvd/0e6+otwx0/gzmvglqtJhxf8YmIPnvSLcGgP6Yvvwe75Gemen2SRTt2Sfyl3132w+RS45JWkg7vh3/8Ou/lquPOnpG03wKOeSlp3PPzse5mt/grpSc+D8RnsC++G22+Au3+c30O8/rj8A6V7d+bfab/rp5mvufVUm8/FvvoRuPF72N035imhZC2qd72tO47qhFOxg3vg4Qfyb3zMriH93PNhaYF07TfzT0RvPoPq9MfA/bfBg/fn/mc/lrThJLjruvzz2OWuA9djXcPGE/Oo+fBWuPdW30IOBtaUOA3gpDNIj392dv52J//O5J3XNC8hTwlOPhsuuAgWDpG+8Fdwx81w5435B1i7PU+cq/CsV5OqNnbV5+GHnyXdfjV2x0/g4YegmhjegEzOdPl2/soUPSSAkmC9oiThMAvS9D/4mj8yFxZGpaN/m5CpXV3LQS4xIhXlJqYC8xmh1zWnze6D8EXc4TiW5P8k2EjJzf4cwrqTsck5mFiT1xKDKr9kGoOJSV+r9LGZ9aTptaTp9XDc6Vmu5YX8grdHP5006MGVn8KOLkN7Cloz2MH9cP9dmfcpf0y3lbDx8fwY8NgkTM3C+NrcnirSwV1Z5lYr/8Z7axzW5leA0jPoTOdPxYiupb8Eu+7Hev2ctVuG1Stw7hMyrVuuwlb9wa6J6SzrylLu26phbCrL1F0atoNoWJ1/STgZLC142+gchzwKdyq48IUw6MJ3/zn/zN6G42F2Jr8gkBpaFelRT84vmvvxN6A/Dq1JaPtP01Upw1U1zG7I07KxMapTt2CnnAcnn+3vGAubKtFf5eDFB3F/CnDyI/lnCajSIcDon37ER9uXalUwpICsOGrUpo6lZRU5uytboPoWrlrrh0ALGqFGR3cYiRgB+PStlIzTWuNw3/XZyE98HrzybfCKt8DzXwdnPpo0WM6w4xP53btrN2G/8g7sV/6Q+pf/hHSO/1T1g/dl1o47OYu0Z6f/NINlw/pao6qqPM82y7/J3h7LPzD6sv8Ov/Rb+YXdmzbD0hL20LYMV7uO6jo7d1WBLYddLpopUPIdRSPD7bkfVhdg/Ukw3oGxiurMC7CVFXjgNn8hHzA5DSRsddFtmWBiAqvr/NvyUW+uOyqD8U6+xrd4qFG17IrzjGUHnjsOe2gr7LwPbvthHtXOf55vQriM8xtyMOy+L2+K4Bf1Tj8Xxlo5WXcmoVXll0dc8hrqF78JXvxm0sv/AGYmPRAUHCM+U2I4OFtyHYtnNRXQkSWFNotKu+GPrTFMUA6rKFVzJD5EzZEfk9GdYOkbRg8cPj1CgipBJD5iHI7QDrE9dGCAGfbwTvjX98Ft15D27SStLpBOOB1e+N+wqam8GzU1l/PE8nJerywchaMHsK23YF/7KCwcyQvUsam8LtGPxyRyoA5q2HB8ZnfhSG5rtf0V/8DhQ7BmPcyvzz+i+bm/9DcQJUfiupicwgaWN6bUNKRnLynLxspi3u2ZmoaZNXDKFmzNxvwbj0ePNHqbmsk8Lx/N/FbtPJLU/RwkJcH4Lhl+fWF2XV5UHz1YJh3ZHm4TgIkWPOVFWN0n3fcTWLcJjuyEiVnSWVtysBn50eFOO6Pv+7Zuq4ItT4Vfej2ccFbWR3sq89MdUN97A9X2O6m23wV3X48tLTa+80ilTN3D5o55vYUAKCOOn2tNNpRoVfRkooSWEkZLjNwCR1CYHevpMmRhXPD+XT6aDwpe/dVHgvh5Gq0TD1pwqmgEbOcf6bni09hlfwuf/0u452fZUWbmfVdmDVQJ+9lV8Pn3YJ//K/jCpfDVj8Gunf60X5V/tz21YG4TVpnv3/dhfh7Wn5DfU7tyMLPe7pCqhC0chq+9Hy77W1Krk7cz+13Xlz5eOh3odbNj4lNBySQjS2Y8iezZkc83nAjnPQVLdV77KABbCcYm808nrK76FC+PcnRX8xSsXAhUVvWRanoNNhjA8hG3hzs3upA7gNO3wJo5wLBn/Rq86m2kZ70BeqtU42Ok+eNJpl8wa+cXbs+u8VGxhpNPh24fFg5kHU+tyagfuh++9hHqyz5C/eV/xL7+zznB2MjMJvqNVCNfif4hP5PuolvGdyuUSn3jFxMb7KEtEmr8soElRGYIitFgUX+0qA8CaU0wBK+LRjg/gV7JAEFRFnnDDSihe7BuLayfy0P9/AnYulOwdcfltcXC4Txlmp7P9zCtLEBrjX9m8tol+Q8VVVV+8XYF6ZJXwIZ5mJuETWvhua+DqqK++SpgPF/raOVXgHL0IFTrYP8+7KarSFULnvKy/MrSKHrbldhfAf/56sbY0rOmWxk2VW3YcU/OzI95Nun4M/N27qGDfv3I8iO+49NYfxVWlvM0qErQ6eSgnV2T1w7T4zAxVrJuSi2YmIF6QBrvwPwMzE3D7FQOdKtheor0lF8k9btw50/g7mvhtquwW39Ievh+rDNBOv8Z+We5MVjyUfaSX4bj1sL6NfkaUSK/3DslGPTymyHXHwfHnwbrN8D69bB+LUxNNtP3rJigI/+XcB90fco35KMRNvrqkB9pMMhJvkXnrLy7hT3CFp/XgxMcnfu7oQvRcAepN5eDIQbDeSnq5w3O4HBHhxnCpeLwhR/yovh17yQ9/hdgy4Ww5SK44FkwNQ93/jTv7JjB6Y+D086FW37gW5GuPA3TpKyb3ffB6U/Ia5Mtz4THPTNv507OwM674crP5t0ygLkNpMdenNcG27eSUgf23k06/1lwytlw+zXQ7TaJotOCJzwblhbhdh8JpOskXsKxhFw+BOc+Of/2PC246nNwZNHxpvyLDOc/I2fnW39YLgqmsx+HrVkH5/0cbHkaXHAJ6XHPyFOwh+6DVgfOe3IebR/zNNhyCZx/CZz/9Lygv//WrM8zz4ett8J3Pw333wPb74UH7sb23IU9/jlZNzdcCa0J2HMPnHcRTM/B+c+C8y7O12Iswc1XQtfy71lueTpMjsPjnguPewbpsc/M9mtPwPa73e+GjN/4RIrTftlO349QV2ztPif/CjrOQZIcqvhkJKLiRjM5qYjQZHjVa44nMBiuk/EtzCpE2yQoDf7RktKxCyz8ynvkoa7zdqT1YfkIqb8Ch/fD9d+Fn3wNkt+JO7cB5tbBNV8vM46m+IlZ3pm558dQjUG7Ii0cyYvVH/wbXP9tSBONjlotOOksuPFKWFzKxugDu7aS1m+GXQ/AwiHH3wIbkE46O08F9z7kyTDIODSiW3OnQa+b7yYYn4DbroWtt4UAS1kvGzfnN+tvuzPjqA3278zrpO4SrC6Rlo6Ququw7RY4eCDT2LsN1h4Hi0dh6SgsHyWtLsP2O2HfbtLJZ+Wr5j/4AqlrzbM5pLz1PDGbRw/RXe3BPT/JV9G7XdLSwbyGu/dneXva2lnu7bfD/HE5YawswOJBWF6Cm344/AL0FH0l+I8qko+maowuU3TrzqeZSXJfFbKUSEw/r3GJ6LSmilCic8eiwFEglFGATMx8elSkOEaqkWMvVuUtQQWEBWGKMkZoipfab6kYdJs3bSQXsGp7xq/zcb+bA6ny20qQrHH6KaXnayD5viKnoeDQQFyTp3r9LmlsArNWuMmun38/pOVvS6lSc/dz3SW1KqzWlugoD6P2cIevB/kKfGssjwBxAU6d22j5Q1Aabb1P2X10/bWn/W0r5LWR9YP+XC/ticxz7bptebIRTzJAfyWvCVu6mi956nw7jPn7Ayp/u0vlV+8H/utksq9u6W918rTUX1PU+NKoQ9LIn3CaI3BmzvPI8gAan/LbhhJTzxvxBFeE+byuOHxwbjlrNGDJXAwzH5mLeCyeh3Zd8DGyEKPDqkrlOIaUFBRj1txHJTrJHbWwF4OZLLOmKZrXDsF6BklVvjepyi+gziIEncR+Bbcvoge1O4bDSg9lfeajhPiBZqSWmGUpp7l35Fl6VZvrVA+WlVFGOHQekowaJUNRseNV0kqyb0xUoi/h9XiAH6caar+RLPIh2yScBk1SsuTPlaQcMJZ85uA44jolKQm4nVKkH3gUrPwtFuFwvecgKUMSjSXMmSsnI8NVMZJKNLQDlP76lmJGgi8580rF5g6oG++Er+DSsSshkCyGLo5XGkb6hmpzxy19aXj0w4a8HMLxR6fCQjAJf9CDRtMiUwpO50EmAyEndfzm8IVn6c+RWfLX90R+RTd/NbyqUoEd64Q7nJc6IQ5yD8EFXEMJRzK4vNIzhBFIdc5TQRXkT95/6KZWySW9ur4THiAxgGXfosRjbaMSTjOHUU/mw0w5cYVFY0X4UqQMdxSSC+V9U+TB26UoOYkQuy4yd49E0BGZlBmzgYxJ2CkTnbrhT/UWFFUyt/NSZA44EXzky/kwhnlTveSPRTiiQYf66Tx0lIHVlisDr6KN6z+CxD5eWfSgKuFSH9dfgXEao4EVdRzhCr8OJx4t8FrgwyMaozpQqTUSBt4KXeGULvy8+JB/SzZ8hFEcF915X9kkz7jEWMBVspmXyHgx+IgAQhCNKmJYGHWEJ1w9Ln11HL/j8Yjhj3G+NKz8kmm9LrksOpGxCx8hG5UG76sAa4C9zutTNI66RicJujEbGYUJQeOwSSNLdJwRu4yWIrroOA+xUxx9irOPOGZ0zhQcqYD7SdFVZGqkr8kxA41Cj2ZqVe6r8noLSVa4RE+PEpQ28eI6NcGFq+2F/3CcnG6UHdF1WwzfBSwniEVCxSIKI0ILqUCGYFQZjKxuQQ8NasGO0JbQFhzSnG6si7SHnCwQTKLjNMoaIcgBjeLFZ8xgQ3jFB/lfcp4Krshf1IVgghzlE3E4r+KjjJajcI4LD+BYZxZGU9U7qIJH9cVZR+K5yOxtMGJXx130G9ZaxcBR30LkhIQ71a5rb1f35PQUGIWHcjAc/OLDpH9NWXVeOjWjjilgM4E83Uph3oZ/C+FokTwp+XxSH4G7YPqQnEnvLyEJETtaSmbw9jg6DfVx3ENToaYpV0lgfJ5chyvHAg6On5Ibxz/CK5zqIvjieF6K8ZXVTF7YwKifdJWC4xa5HS65PghBloTTr3wnXQGPRUL7R4fCXQJWVSM0JB+Ov/iE6nAegn4LvkBjaArrJdGsAXGdJ4eJNCoa3ZRRog73g3m9/Fb0MSdi2dbFnwgRP+I7hU/vq2Av0y0pOMhROhyjfGeqKDGWwGRxziA0IXNIgaVJER7R1M0cFLVFgQP+yIr4K7zrmQZXjKwqPJFu6VuQNTiJ8nhJznsGCryr3fGVqZkaQ2DVkl0wob3YVHj8PCYexN9Qhcvg9UXu/6CouzECF+Q2qU51o3BOI/KpfsUe3hATC1E2GWJEPgfLJKpmFqC64tTxO45w+naeI+7k/2TjwktG3izcy0eAATgqm5AtSwl9dFD055ViRFmjQdwoT30kdOxv/k8wo7yic4cxKd6aKUbTMX/KPDgFnzU3gp+mIL9ZGMmKsL4dLRqjn0eQVxlMVUk6GEY7hKPU+4HWdPlkhK/wKfyPFjUI1nkovAZeCojrcki3HGsr0YXhWYDJNv+BjTU6anok+FKi84pnbxqSU0QCndI2IpTkTYwEveyTX/FR6nIJDMQqHSgzlCqH1zc0BMyjOfm32keV48wM4YpMWwFqlIe3F1ySwV+4kBxnaRPupqrp73KVN9kHoFr8RsVHx5fjhG5DPOlYCnZajcKbMuoURiNz6edwRjPdwkZGKTlv+Kit2GmooWmLupWMo/Ya+pbjx7rIc4T3ZDREx5t0YjTwCV+DqsrrI9uoPfjNEFxq8JqFZKLuAVa0xL/LkN9cPEQ1GtPP9a2sIBCnD9oBCRJHBzU8Q0gY75i8TxLugD8qsvDivBZ+vD3KkJTZfUj25dIQ/0TcjExdhCvOw6XMGJR+XmQQrI8ohdSITPhap4wECmjHU9AnxxNHQZWAv/Zz1QtZWYRqChdGOpMzqI9/iizelApjDag6Rj1oB6ngcVpDNnQ7pRFfMXfOUT4grBO0llR70Kny/FBC9cbkcibHkYl5s+MqupD8ote8wC6/Fm9oByJTSYWgItSRiAlFZHLo4mgOUCI2CB2Ph67FOHyB8zIUwIF4qdLBaHEFoWnU6IM30oYHbFBIrhOOYZRD2bqOiqbZJ01p+Op56eP95DSRVnQmKV5BVPTk9QVIQe/4h4J3NAhCkeiIroOoPrYN7SSqze1ckoLrSfaPOlNbFiTI7v+KrCN9iq0CjwJSX52kEIyR/yHegoDiveCJSWhkRuAHvibRLosa0SuKcylRKsb9XzFuHPYDY0Xh+ufMJc/2wq3tviGHwq+sSjh36IzcM8Mwz6XCxEvgIeHncXTxOmIQKQOpf8BFFTKR8yF+oFGyvkWTiC8GX3AU4TCCrGqPQkR+6kZe2UhFICmOTuKFkQQTgkXARV/iy45VdqkKPFmgU5LIiF0FJ1pqH5LZS9RVOXd91o/Al43wYN4v6q5WcBWEWZe1YEIyxPQ8ieocCZoKSAghFK1AQF0CmpL9Sp0YT01G0c6VHEL8DSF0BEXZQeHOZilFT6HSRngtOgj8FSWrzukIX2Ej+dZjULZgcR5HDVJwi074LiX2CefVCG7pPeIzwUsvYjYE3xDd0WwfgqDoWLh1Ho5HZYLGnjHoCojDV8Kvere7bpxUJyU+IRCOUFVKcpxGY3PB6FP6un4kR0Xjc0WmoAPCPV/5TA2BgubzhSsJMqKAwlAKOEYygbqWDKpGH0EKkE9VhiQdNEZKYS5b6LoCIn8EYSMfgknRaMoosb/zYX4cvobuTSu4HY+cJ6luCMhPnelIzlwGGVKlFryAorxepIOinODUQzL5SCMw8azDpKkb7kwecFXp0NgmpeCU7qSjuiiHskG0s+OOwSmdFXHr5sd5og412os/yaRki4ImfA99HJ94K1Vu8+S+Dx4oGfb/A7dTTXA7SF2tAAAAAElFTkSuQmCC";

// ---- Impianti / campi ----
const FIELDS = [
  { id: "calcio5", name: "Calcio a 5", short: "C5", color: "#2E7D32", tint: "#E6F1E7", price: 60 },
  { id: "padel1", name: "Padel 1", short: "P1", color: "#1565C0", tint: "#E4EDF8", price: 40 },
  { id: "padel2", name: "Padel 2", short: "P2", color: "#0097A7", tint: "#E0F1F3", price: 40 },
  { id: "evento", name: "Evento / Festa", short: "EV", color: "#AD1457", tint: "#F8E5EF", price: 0 },
];
const FIELD_MAP = Object.fromEntries(FIELDS.map((f) => [f.id, f]));

const HOURS = Array.from({ length: 17 }, (_, i) => i + 8);
const GIORNI = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const GIORNI_FULL = ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"];
const MESI = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];

const iso = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const startOfWeek = (d) => {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
};
const sameMonth = (isoStr, ref) => {
  const [y, m] = isoStr.split("-").map(Number);
  return y === ref.getFullYear() && m === ref.getMonth() + 1;
};
const eur = (n) => "€ " + Number(n).toLocaleString("it-IT", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

// costruisce il link WhatsApp con messaggio di conferma precompilato
const waLink = (b) => {
  const f = FIELD_MAP[b.field];
  const d = new Date(b.date + "T00:00:00");
  const dataIt = d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
  const ora = String(b.hour).padStart(2, "0") + ":00";
  const durata = (b.duration || 1) + "h";
  const msg =
    `Ciao ${b.name || ""}, ti confermo la prenotazione presso Atene Central Village:\n` +
    `🏟️ ${f.name}\n📅 ${dataIt}\n🕒 ${ora} (${durata})\n\n` +
    `📍 ASD Rosario Central, Via Palmara, 98124 Messina ME\n` +
    `🗺️ https://maps.app.goo.gl/jB7fNGTU4SHXpSdx8\n\n` +
    `A presto!`;
  // pulisce e normalizza il numero con prefisso italiano se manca
  let num = (b.phone || "").replace(/[^\d]/g, "");
  if (num) {
    if (num.startsWith("39")) {
      // già con prefisso, ok
    } else if (num.startsWith("0039")) {
      num = num.slice(2);
    } else if (num.startsWith("0")) {
      num = "39" + num.slice(1);
    } else {
      num = "39" + num;
    }
  }
  const base = num ? `https://wa.me/${num}` : `https://wa.me/`;
  return `${base}?text=${encodeURIComponent(msg)}`;
};

const overlaps = (a, b) => {
  if (a.field !== b.field || a.date !== b.date) return false;
  const aEnd = a.hour + (a.duration || 1);
  const bEnd = b.hour + (b.duration || 1);
  return a.hour < bEnd && b.hour < aEnd;
};

// mappa riga DB (snake) -> oggetto app (camel)
const fromRow = (r) => ({ id: r.id, field: r.field, date: r.date, hour: r.hour, duration: Number(r.duration), name: r.name, phone: r.phone, note: r.note, price: r.price == null ? null : Number(r.price) });
const toRow = (b) => ({ id: b.id, field: b.field, date: b.date, hour: b.hour, duration: b.duration, name: b.name, phone: b.phone, note: b.note, price: b.price });

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = in caricamento

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) return <div style={s.center}>Caricamento…</div>;
  if (!session) return <Login />;
  return <Calendar session={session} />;
}

// ---------------- LOGIN ----------------
function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr(""); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
    if (error) setErr("Email o password non corretti.");
    setBusy(false);
  };

  return (
    <div style={s.loginWrap}>
      <style>{globalCss}</style>
      <div style={s.loginCard}>
        <img src={LOGO_DATA_URI} alt="Atene Sport Village" style={s.loginLogo} />
        <h1 style={s.loginTitle}>Atene Central Village</h1>
        <p style={s.loginSub}>Accesso staff</p>
        <input style={s.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={{ ...s.input, marginTop: 10 }} type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        {err && <div style={s.loginErr}>{err}</div>}
        <button style={{ ...s.addBtn, width: "100%", justifyContent: "center", marginTop: 14, opacity: busy ? 0.6 : 1 }} onClick={submit} disabled={busy}>
          {busy ? "Accesso…" : "Entra"}
        </button>
        <p style={s.loginHint}>Gli account dello staff si creano dal pannello Supabase (Authentication &gt; Users).</p>
      </div>
    </div>
  );
}

// ---------------- CALENDARIO ----------------
function Calendar({ session }) {
  const [view, setView] = useState("week");
  const [current, setCurrent] = useState(() => startOfWeek(new Date()));
  const [dayDate, setDayDate] = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d; });
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [modal, setModal] = useState(null);
  const [showRubrica, setShowRubrica] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [query, setQuery] = useState("");
  const [online, setOnline] = useState(true);

  // caricamento iniziale + realtime
  useEffect(() => {
    let active = true;
    (async () => {
      const { data: bk, error: e1 } = await supabase.from("bookings").select("*");
      const { data: cl, error: e2 } = await supabase.from("clients").select("*");
      if (!active) return;
      if (e1 || e2) setOnline(false);
      if (bk) setBookings(bk.map(fromRow));
      if (cl) setContacts(cl);
    })();

    const ch = supabase
      .channel("realtime-atene")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, (p) => {
        setBookings((prev) => {
          if (p.eventType === "DELETE") return prev.filter((x) => x.id !== p.old.id);
          const rec = fromRow(p.new);
          return [...prev.filter((x) => x.id !== rec.id), rec];
        });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, (p) => {
        setContacts((prev) => {
          if (p.eventType === "DELETE") return prev.filter((x) => x.id !== p.old.id);
          return [...prev.filter((x) => x.id !== p.new.id), p.new];
        });
      })
      .subscribe((status) => setOnline(status === "SUBSCRIBED"));

    return () => { active = false; supabase.removeChannel(ch); };
  }, []);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => { const d = new Date(current); d.setDate(d.getDate() + i); return d; }),
    [current]
  );

  const saveBooking = async (b) => {
    const rec = { ...b, id: b.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())) };
    setBookings((prev) => [...prev.filter((x) => x.id !== rec.id), rec]); // ottimistico
    const { error } = await supabase.from("bookings").upsert(toRow(rec));
    if (error) { alert("Salvataggio non riuscito: " + error.message); }
    if (rec.name) {
      const exists = contacts.some((c) => c.name.toLowerCase() === rec.name.toLowerCase());
      if (!exists) saveContact({ name: rec.name, phone: rec.phone || "" });
    }
    setModal(null);
  };

  const deleteBooking = async (id) => {
    setBookings((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("bookings").delete().eq("id", id);
    setModal(null);
  };

  const saveManyBookings = async (list) => {
    // scarta quelle che si sovrappongono a prenotazioni esistenti
    const toInsert = [];
    let skipped = 0;
    for (const b of list) {
      const cand = { field: b.field, date: b.date, hour: b.hour, duration: b.duration };
      const clash = bookings.some((x) => overlaps(x, cand)) || toInsert.some((x) => overlaps(x, cand));
      if (clash) { skipped++; continue; }
      toInsert.push({ ...b, id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random() });
    }
    if (toInsert.length) {
      setBookings((prev) => [...prev, ...toInsert]);
      const { error } = await supabase.from("bookings").upsert(toInsert.map(toRow));
      if (error) alert("Errore nel salvataggio: " + error.message);
    }
    // rubrica automatica dal primo nome
    const nm = list[0]?.name;
    if (nm) {
      const exists = contacts.some((c) => c.name.toLowerCase() === nm.toLowerCase());
      if (!exists) saveContact({ name: nm, phone: list[0].phone || "" });
    }
    setModal(null);
    alert(`Create ${toInsert.length} prenotazioni.` + (skipped ? ` ${skipped} saltate per sovrapposizione.` : ""));
  };

  const saveContact = async (c) => {
    const rec = { ...c, id: c.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())) };
    setContacts((prev) => [...prev.filter((x) => x.id !== rec.id), rec]);
    const { error } = await supabase.from("clients").upsert(rec);
    if (error) alert("Salvataggio cliente non riuscito: " + error.message);
    return rec;
  };

  const deleteContact = async (id) => {
    setContacts((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("clients").delete().eq("id", id);
  };

  const shiftWeek = (n) => { const d = new Date(current); d.setDate(d.getDate() + n * 7); setCurrent(startOfWeek(d)); };
  const shiftDay = (n) => { const d = new Date(dayDate); d.setDate(d.getDate() + n); setDayDate(d); };
  const today = iso(new Date());

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return bookings
      .filter((b) => (b.name || "").toLowerCase().includes(q) || (b.phone || "").includes(q))
      .sort((a, b) => (a.date + String(a.hour).padStart(2,"0")).localeCompare(b.date + String(b.hour).padStart(2,"0")));
  }, [query, bookings]);

  const revenue = useMemo(() => {
    const valueOf = (b) => {
      const f = FIELD_MAP[b.field];
      return b.price != null ? Number(b.price) : f.price * (b.duration || 1);
    };
    const refDay = view === "day" ? dayDate : new Date();
    const dayStr = iso(refDay);
    const weekSet = new Set((view === "week" ? weekDays : Array.from({ length: 7 }, (_, i) => { const d = startOfWeek(refDay); d.setDate(d.getDate() + i); return d; })).map(iso));
    let day = 0, week = 0, month = 0, dayCount = 0;
    const byField = {};
    const cat = { calcio: { day: 0, week: 0, month: 0 }, padel: { day: 0, week: 0, month: 0 }, evento: { day: 0, week: 0, month: 0 } };
    for (const b of bookings) {
      const v = valueOf(b);
      const isDay = b.date === dayStr, isWeek = weekSet.has(b.date), isMonth = sameMonth(b.date, refDay);
      if (isDay) { day += v; dayCount++; }
      if (isWeek) week += v;
      if (isMonth) month += v;
      const key = b.field === "calcio5" ? "calcio" : (b.field === "padel1" || b.field === "padel2") ? "padel" : b.field === "evento" ? "evento" : null;
      if (key) { if (isDay) cat[key].day += v; if (isWeek) cat[key].week += v; if (isMonth) cat[key].month += v; }
      const inScope = view === "day" ? isDay : isWeek;
      if (inScope) byField[b.field] = (byField[b.field] || 0) + v;
    }
    return { day, week, month, byField, dayCount, refDay, cat };
  }, [bookings, view, weekDays, dayDate]);

  return (
    <div style={s.app}>
      <style>{globalCss}</style>

      <header style={s.header}>
        <div style={s.brand}>
          <img src={LOGO_DATA_URI} alt="Atene Sport Village" style={s.headerLogo} />
          <div>
            <div style={s.brandTitle}>Atene Central Village</div>
            <div style={s.brandSub}>
              {online ? <><Wifi size={12} style={{ verticalAlign: "-1px" }} /> Sincronizzato</> : <><WifiOff size={12} style={{ verticalAlign: "-1px" }} /> Non connesso</>}
              {" · "}{session.user.email}
            </div>
          </div>
        </div>
        <div style={s.searchWrap}>
          <Search size={15} style={s.searchIcon} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca cliente o telefono…" style={s.searchInput} />
          {query && <button style={s.searchClear} onClick={() => setQuery("")}><X size={14} /></button>}
        </div>
        <button style={s.rubricaBtn} onClick={() => setShowRubrica(true)}>
          <Users size={16} /> Rubrica <span style={s.rubricaCount}>{contacts.length}</span>
        </button>
        <button style={s.rubricaBtn} onClick={() => setShowReport(true)}>
          <BarChart3 size={16} /> Report
        </button>
        <button style={s.headerIconBtn} title="Esci" onClick={() => supabase.auth.signOut()}><LogOut size={16} /></button>
      </header>

      {query ? (
        <SearchResults results={results} onOpen={(b) => setModal(b)} onClose={() => setQuery("")} />
      ) : (
        <>
          <div style={s.toolbar}>
            <div style={s.viewToggle}>
              <button style={{ ...s.toggleBtn, ...(view === "week" ? s.toggleActive : {}) }} onClick={() => setView("week")}>Settimana</button>
              <button style={{ ...s.toggleBtn, ...(view === "day" ? s.toggleActive : {}) }} onClick={() => setView("day")}>Giorno</button>
            </div>
            <div style={s.centerNav}>
              {view === "week" ? (
                <>
                  <button style={s.iconBtn} onClick={() => shiftWeek(-1)}><ChevronLeft size={18} /></button>
                  <button style={s.todayBtn} onClick={() => setCurrent(startOfWeek(new Date()))}>Oggi</button>
                  <button style={s.iconBtn} onClick={() => shiftWeek(1)}><ChevronRight size={18} /></button>
                  <span style={s.weekLabel}>{weekDays[0].getDate()} {MESI[weekDays[0].getMonth()].slice(0,3)} – {weekDays[6].getDate()} {MESI[weekDays[6].getMonth()].slice(0,3)}</span>
                </>
              ) : (
                <>
                  <button style={s.iconBtn} onClick={() => shiftDay(-1)}><ChevronLeft size={18} /></button>
                  <button style={s.todayBtn} onClick={() => { const d = new Date(); d.setHours(0,0,0,0); setDayDate(d); }}>Oggi</button>
                  <button style={s.iconBtn} onClick={() => shiftDay(1)}><ChevronRight size={18} /></button>
                  <span style={s.weekLabel}>{GIORNI_FULL[(dayDate.getDay()+6)%7]} {dayDate.getDate()} {MESI[dayDate.getMonth()]}</span>
                </>
              )}
            </div>
            <button style={s.addBtn} onClick={() => setModal({ date: view === "day" ? iso(dayDate) : today, hour: 18 })}>
              <Plus size={16} strokeWidth={2.6} /> Prenota
            </button>
          </div>

          <div style={s.revBar}>
            <div style={s.revTotals}>
              <div style={s.revCard}><span style={s.revLbl}>Oggi</span><span style={s.revNum}>{eur(revenue.day)}</span></div>
              <div style={s.revCard}><span style={s.revLbl}>Settimana</span><span style={s.revNum}>{eur(revenue.week)}</span></div>
              <div style={{ ...s.revCard, ...s.revCardMonth }}><span style={s.revLbl}>{MESI[revenue.refDay.getMonth()]}</span><span style={s.revNum}>{eur(revenue.month)}</span></div>
            </div>
            <div style={s.catPanels}>
              <CatPanel label="Calcio a 5" color="#2E7D32" data={revenue.cat.calcio} monthName={MESI[revenue.refDay.getMonth()]} />
              <CatPanel label="Padel" color="#1565C0" data={revenue.cat.padel} monthName={MESI[revenue.refDay.getMonth()]} />
              <CatPanel label="Eventi" color="#AD1457" data={revenue.cat.evento} monthName={MESI[revenue.refDay.getMonth()]} />
            </div>
          </div>

          {view === "week"
            ? <WeekGrid weekDays={weekDays} bookings={bookings} today={today} onSlot={setModal} onEvent={setModal} />
            : <DayGrid date={dayDate} bookings={bookings} onSlot={setModal} onEvent={setModal} />}
        </>
      )}

      {modal && <BookingModal data={modal} bookings={bookings} contacts={contacts} onClose={() => setModal(null)} onSave={saveBooking} onSaveMany={saveManyBookings} onDelete={deleteBooking} />}
      {showRubrica && <RubricaModal contacts={contacts} onClose={() => setShowRubrica(false)} onSave={saveContact} onDelete={deleteContact} />}
      {showReport && <ReportModal bookings={bookings} onClose={() => setShowReport(false)} />}
    </div>
  );
}

function CatPanel({ label, color, data, monthName }) {
  return (
    <div style={s.catPanel}>
      <div style={s.catHead}><span style={{ ...s.dot, background: color }} />{label}</div>
      <div style={s.catRows}>
        <div style={s.catRow}><span style={s.catRowLbl}>Oggi</span><span style={s.catRowVal}>{eur(data.day)}</span></div>
        <div style={s.catRow}><span style={s.catRowLbl}>Sett.</span><span style={s.catRowVal}>{eur(data.week)}</span></div>
        <div style={s.catRow}><span style={s.catRowLbl}>{monthName.slice(0,3)}</span><span style={{ ...s.catRowVal, fontWeight: 800 }}>{eur(data.month)}</span></div>
      </div>
    </div>
  );
}

function WeekGrid({ weekDays, bookings, today, onSlot, onEvent }) {
  return (
    <div style={s.gridWrap}>
      <div style={s.grid}>
        <div style={s.corner}>Ora</div>
        {weekDays.map((d, i) => {
          const isToday = iso(d) === today;
          return (
            <div key={i} style={{ ...s.dayHead, ...(isToday ? s.dayHeadToday : {}) }}>
              <span style={s.dayName}>{GIORNI[i]}</span>
              <span style={{ ...s.dayNum, ...(isToday ? s.dayNumToday : {}) }}>{d.getDate()}</span>
            </div>
          );
        })}
        {HOURS.map((h) => (
          <React.Fragment key={h}>
            <div style={s.hourCell}>{String(h).padStart(2, "0")}:00</div>
            {weekDays.map((d, di) => {
              const dateStr = iso(d);
              const cell = bookings.filter((b) => b.date === dateStr && b.hour === h);
              return (
                <button key={di} style={s.slot} onClick={() => onSlot({ date: dateStr, hour: h })}>
                  {cell.map((b) => {
                    const f = FIELD_MAP[b.field];
                    return (
                      <div key={b.id} onClick={(e) => { e.stopPropagation(); onEvent(b); }} style={{ ...s.event, background: f.tint, borderLeft: `3px solid ${f.color}` }}>
                        <span style={{ ...s.evTag, color: f.color }}>{f.short}</span>
                        <span style={s.evName}>{b.name || f.name}</span>
                      </div>
                    );
                  })}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function DayGrid({ date, bookings, onSlot, onEvent }) {
  const dateStr = iso(date);
  return (
    <div style={s.gridWrap}>
      <div style={s.dayGrid}>
        <div style={s.corner}>Ora</div>
        {FIELDS.map((f) => (
          <div key={f.id} style={{ ...s.dayHead, borderBottom: `3px solid ${f.color}` }}>
            <span style={s.dayColName}>{f.name}</span>
          </div>
        ))}
        {HOURS.map((h) => (
          <React.Fragment key={h}>
            <div style={s.hourCell}>{String(h).padStart(2, "0")}:00</div>
            {FIELDS.map((f) => {
              const cell = bookings.filter((b) => b.date === dateStr && b.field === f.id && b.hour === h);
              return (
                <button key={f.id} style={s.slot} onClick={() => onSlot({ date: dateStr, hour: h, field: f.id })}>
                  {cell.map((b) => (
                    <div key={b.id} onClick={(e) => { e.stopPropagation(); onEvent(b); }} style={{ ...s.event, background: f.tint, borderLeft: `3px solid ${f.color}` }}>
                      <span style={s.evName}>{b.name || f.name}</span>
                      <span style={s.evMeta}>{String(h).padStart(2,"0")}:00 · {b.duration || 1}h</span>
                    </div>
                  ))}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function SearchResults({ results, onOpen, onClose }) {
  return (
    <div style={s.searchPage}>
      <div style={s.searchHead}>
        <span>{results.length} risultat{results.length === 1 ? "o" : "i"}</span>
        <button style={s.todayBtn} onClick={onClose}>Torna al calendario</button>
      </div>
      {results.length === 0 ? (
        <div style={s.empty}>Nessuna prenotazione trovata.</div>
      ) : (
        <div style={s.resList}>
          {results.map((b) => {
            const f = FIELD_MAP[b.field];
            return (
              <button key={b.id} style={s.resItem} onClick={() => onOpen(b)}>
                <span style={{ ...s.resTag, background: f.tint, color: f.color }}>{f.short}</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={s.resName}>{b.name || f.name}</div>
                  <div style={s.resMeta}>
                    {new Date(b.date + "T00:00:00").toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })}
                    {" · "}{String(b.hour).padStart(2,"0")}:00 · {b.duration || 1}h{b.phone ? ` · ${b.phone}` : ""}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BookingModal({ data, bookings, contacts = [], onClose, onSave, onSaveMany, onDelete }) {
  const editing = !!data.id;
  const [field, setField] = useState(data.field || "calcio5");
  const [date, setDate] = useState(data.date);
  const [hour, setHour] = useState(data.hour ?? 18);
  const [duration, setDuration] = useState(data.duration || 1);
  const [name, setName] = useState(data.name || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [note, setNote] = useState(data.note || "");
  const [price, setPrice] = useState(data.price != null ? data.price : "");
  const [showList, setShowList] = useState(false);
  // ricorrenza
  const [repeat, setRepeat] = useState("none"); // none | weekly | days | daily
  const [repeatDays, setRepeatDays] = useState([]); // 0=Lun..6=Dom, per "days"
  const [repeatUntil, setRepeatUntil] = useState("");

  const matches = useMemo(() => {
    const q = name.trim().toLowerCase();
    const list = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return list;
    return list.filter((c) => c.name.toLowerCase().includes(q) || (c.phone || "").includes(q));
  }, [name, contacts]);

  const pickContact = (c) => { setName(c.name); setPhone(c.phone || ""); setShowList(false); };

  const candidate = { id: data.id, field, date, hour: Number(hour), duration: Number(duration) };
  const conflict = bookings.find((b) => b.id !== data.id && overlaps(b, candidate));

  const submit = () => {
    if (!name.trim() || conflict) return;
    const f = FIELD_MAP[field];
    const finalPrice = price === "" ? f.price * Number(duration) : Number(price);
    const base = { field, hour: Number(hour), duration: Number(duration), name: name.trim(), phone: phone.trim(), note: note.trim(), price: finalPrice };

    // se non è ripetuta o siamo in modifica, comportamento normale (una sola)
    if (editing || repeat === "none" || !repeatUntil) {
      onSave({ id: data.id, date, ...base });
      return;
    }

    // genera l'elenco di date dalla data iniziale fino a repeatUntil
    const dates = [];
    const start = new Date(date + "T00:00:00");
    const end = new Date(repeatUntil + "T00:00:00");
    if (end < start) { onSave({ id: data.id, date, ...base }); return; }

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dow = (d.getDay() + 6) % 7; // 0=Lun
      let ok = false;
      if (repeat === "daily") ok = true;
      else if (repeat === "weekly") ok = dow === (start.getDay() + 6) % 7;
      else if (repeat === "days") ok = repeatDays.includes(dow);
      if (ok) dates.push(iso(new Date(d)));
    }
    onSaveMany(dates.map((dt) => ({ date: dt, ...base })));
  };

  const f = FIELD_MAP[field];
  const suggested = f.price * Number(duration);

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.modalHead}>
          <h2 style={s.modalTitle}>{editing ? "Modifica prenotazione" : "Nuova prenotazione"}</h2>
          <button style={s.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <label style={s.label}>Campo</label>
        <div style={s.fieldPicker}>
          {FIELDS.map((ff) => (
            <button key={ff.id} onClick={() => setField(ff.id)}
              style={{ ...s.fieldChip, borderColor: field === ff.id ? ff.color : "#E2E0DB", background: field === ff.id ? ff.tint : "#fff", color: field === ff.id ? ff.color : "#5A574F" }}>
              {ff.name}
            </button>
          ))}
        </div>

        <div style={s.row}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Data</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={s.input} />
          </div>
          <div style={{ width: 92 }}>
            <label style={s.label}>Ora</label>
            <select value={hour} onChange={(e) => setHour(e.target.value)} style={s.input}>
              {HOURS.map((h) => <option key={h} value={h}>{String(h).padStart(2,"0")}:00</option>)}
            </select>
          </div>
          <div style={{ width: 92 }}>
            <label style={s.label}>Durata</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} style={s.input}>
              {[1,1.5,2,3,4,5,6].map((d) => <option key={d} value={d}>{d}h</option>)}
            </select>
          </div>
        </div>

        {conflict && (
          <div style={s.conflict}>
            <AlertTriangle size={16} />
            <span>Sovrapposizione con <b>{conflict.name || FIELD_MAP[conflict.field].name}</b> ({String(conflict.hour).padStart(2,"0")}:00 · {conflict.duration || 1}h). Scegli un altro orario o campo.</span>
          </div>
        )}

        {!editing && (
          <>
            <label style={s.label}>Ripetizione</label>
            <div style={s.repeatRow}>
              {[["none","Nessuna"],["weekly","Settimanale"],["days","Giorni scelti"],["daily","Ogni giorno"]].map(([val,lbl]) => (
                <button key={val} type="button" onClick={() => setRepeat(val)}
                  style={{ ...s.repeatChip, borderColor: repeat === val ? "#0B2545" : "#E2E0DB", background: repeat === val ? "#0B2545" : "#fff", color: repeat === val ? "#fff" : "#5A574F" }}>
                  {lbl}
                </button>
              ))}
            </div>

            {repeat === "days" && (
              <div style={s.dowRow}>
                {["Lun","Mar","Mer","Gio","Ven","Sab","Dom"].map((g, i) => (
                  <button key={i} type="button"
                    onClick={() => setRepeatDays((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])}
                    style={{ ...s.dowChip, borderColor: repeatDays.includes(i) ? "#1565C0" : "#E2E0DB", background: repeatDays.includes(i) ? "#E4EDF8" : "#fff", color: repeatDays.includes(i) ? "#1565C0" : "#5A574F" }}>
                    {g}
                  </button>
                ))}
              </div>
            )}

            {repeat !== "none" && (
              <>
                <label style={s.label}>Ripeti fino al</label>
                <input type="date" value={repeatUntil} min={date} onChange={(e) => setRepeatUntil(e.target.value)} style={s.input} />
                {repeat !== "none" && !repeatUntil && <div style={s.repeatHint}>Scegli una data di fine per creare le prenotazioni ripetute.</div>}
              </>
            )}
          </>
        )}

        <label style={s.label}>Nome / Cliente</label>
        <div style={s.inputIcon}>
          <User size={15} style={s.inputIconSvg} />
          <input value={name} onChange={(e) => { setName(e.target.value); setShowList(true); }} onFocus={() => setShowList(true)} placeholder="Es. Rossi / Festa compleanno" style={{ ...s.input, paddingLeft: 34, paddingRight: 34 }} />
          {contacts.length > 0 && <button type="button" style={s.pickerToggle} onClick={() => setShowList((v) => !v)}><ChevronDown size={16} /></button>}
          {showList && matches.length > 0 && (
            <div style={s.dropdown}>
              <div style={s.dropdownHead}>Rubrica</div>
              {matches.slice(0, 8).map((c) => (
                <button key={c.id} type="button" style={s.dropdownItem} onClick={() => pickContact(c)}>
                  <span style={s.dropAvatar}>{c.name.charAt(0).toUpperCase()}</span>
                  <span style={s.dropName}>{c.name}</span>
                  {c.phone && <span style={s.dropPhone}>{c.phone}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={s.row}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Telefono</label>
            <div style={s.inputIcon}>
              <Phone size={15} style={s.inputIconSvg} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Facoltativo" style={{ ...s.input, paddingLeft: 34 }} />
            </div>
          </div>
          <div style={{ width: 130 }}>
            <label style={s.label}>Prezzo (€)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={String(suggested)} style={s.input} />
          </div>
        </div>

        <label style={s.label}>Note</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Facoltativo" rows={2} style={{ ...s.input, height: "auto", padding: "10px 12px", resize: "vertical" }} />

        <div style={s.modalFoot}>
          {editing ? <button style={s.delBtn} onClick={() => onDelete(data.id)}><Trash2 size={15} /> Elimina</button> : <span />}
          <div style={{ display: "flex", gap: 8 }}>
            {editing && (
              <a href={waLink({ field, date, hour: Number(hour), duration: Number(duration), name: name.trim(), phone: phone.trim() })}
                target="_blank" rel="noopener noreferrer" style={s.waBtn}>
                <MessageCircle size={15} /> WhatsApp
              </a>
            )}
            <button style={{ ...s.addBtn, opacity: name.trim() && !conflict ? 1 : 0.45, cursor: name.trim() && !conflict ? "pointer" : "not-allowed" }} onClick={submit}>
              {editing ? "Salva" : (repeat !== "none" && repeatUntil ? "Crea ripetute" : "Prenota")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RubricaModal({ contacts, onClose, onSave, onDelete }) {
  const [q, setQ] = useState("");
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const list = useMemo(() => {
    const s2 = q.trim().toLowerCase();
    return [...contacts].sort((a, b) => a.name.localeCompare(b.name)).filter((c) => !s2 || c.name.toLowerCase().includes(s2) || (c.phone || "").includes(s2));
  }, [contacts, q]);

  const startEdit = (c) => { setEditId(c.id); setName(c.name); setPhone(c.phone || ""); };
  const reset = () => { setEditId(null); setName(""); setPhone(""); };
  const submit = async () => { if (!name.trim()) return; await onSave({ id: editId, name: name.trim(), phone: phone.trim() }); reset(); };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.modalHead}>
          <h2 style={s.modalTitle}>Rubrica clienti</h2>
          <button style={s.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={s.rubForm}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome cliente" style={{ ...s.input, flex: 1 }} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefono" style={{ ...s.input, width: 130 }} />
          <button style={{ ...s.addBtn, opacity: name.trim() ? 1 : 0.45 }} onClick={submit}>{editId ? "Salva" : <><Plus size={15} /> Aggiungi</>}</button>
          {editId && <button style={s.todayBtn} onClick={reset}>Annulla</button>}
        </div>
        <div style={{ ...s.inputIcon, marginTop: 14 }}>
          <Search size={15} style={s.inputIconSvg} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca in rubrica…" style={{ ...s.input, paddingLeft: 34 }} />
        </div>
        <div style={s.rubList}>
          {list.length === 0 ? (
            <div style={s.empty}>{contacts.length === 0 ? "Nessun cliente ancora. Aggiungine uno o si salveranno da soli quando prenoti." : "Nessun risultato."}</div>
          ) : (
            list.map((c) => (
              <div key={c.id} style={s.rubItem}>
                <span style={s.dropAvatar}>{c.name.charAt(0).toUpperCase()}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={s.resName}>{c.name}</div>
                  {c.phone && <div style={s.resMeta}>{c.phone}</div>}
                </div>
                <button style={s.rubEdit} onClick={() => startEdit(c)}>Modifica</button>
                <button style={s.rubDel} onClick={() => onDelete(c.id)}><Trash2 size={15} /></button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ReportModal({ bookings, onClose }) {
  const oggi = new Date();
  const primoMese = new Date(oggi.getFullYear(), oggi.getMonth(), 1);
  const [dal, setDal] = useState(iso(primoMese));
  const [al, setAl] = useState(iso(oggi));

  const valueOf = (b) => {
    const f = FIELD_MAP[b.field];
    return b.price != null ? Number(b.price) : f.price * (b.duration || 1);
  };

  const dati = useMemo(() => {
    const inRange = bookings.filter((b) => b.date >= dal && b.date <= al);
    // incassi per campo
    const perCampo = {};
    let totale = 0;
    // conteggio prenotazioni per campo
    const contaCampo = {};
    // occupazione per fascia oraria
    const perOra = {};
    for (const b of inRange) {
      const v = valueOf(b);
      perCampo[b.field] = (perCampo[b.field] || 0) + v;
      contaCampo[b.field] = (contaCampo[b.field] || 0) + 1;
      totale += v;
      perOra[b.hour] = (perOra[b.hour] || 0) + 1;
    }
    // fascia più e meno frequentata
    const oreOrdinate = Object.entries(perOra).sort((a, b) => b[1] - a[1]);
    return { inRange, perCampo, contaCampo, totale, perOra, oreOrdinate, count: inRange.length };
  }, [bookings, dal, al]);

  const maxOra = Math.max(1, ...Object.values(dati.perOra));

  const esporta = () => {
    // foglio 1: elenco prenotazioni
    const righe = dati.inRange
      .slice()
      .sort((a, b) => (a.date + String(a.hour).padStart(2, "0")).localeCompare(b.date + String(b.hour).padStart(2, "0")))
      .map((b) => ({
        Data: b.date,
        Ora: String(b.hour).padStart(2, "0") + ":00",
        Durata_h: b.duration || 1,
        Campo: FIELD_MAP[b.field].name,
        Cliente: b.name || "",
        Telefono: b.phone || "",
        Prezzo_EUR: valueOf(b),
        Note: b.note || "",
      }));
    // foglio 2: riepilogo per campo
    const riepilogo = FIELDS.map((f) => ({
      Campo: f.name,
      Prenotazioni: dati.contaCampo[f.id] || 0,
      Incasso_EUR: dati.perCampo[f.id] || 0,
    }));
    riepilogo.push({ Campo: "TOTALE", Prenotazioni: dati.count, Incasso_EUR: dati.totale });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(righe), "Prenotazioni");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(riepilogo), "Riepilogo");
    XLSX.writeFile(wb, `Report_Atene_${dal}_${al}.xlsx`);
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={{ ...s.modal, width: "min(620px, 100%)" }} onClick={(e) => e.stopPropagation()}>
        <div style={s.modalHead}>
          <h2 style={s.modalTitle}>Report & Statistiche</h2>
          <button style={s.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <div style={s.row}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Dal</label>
            <input type="date" value={dal} onChange={(e) => setDal(e.target.value)} style={s.input} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Al</label>
            <input type="date" value={al} onChange={(e) => setAl(e.target.value)} style={s.input} />
          </div>
        </div>

        <div style={s.repTotalCard}>
          <div>
            <div style={s.repTotalLbl}>Incasso totale del periodo</div>
            <div style={s.repTotalNum}>{eur(dati.totale)}</div>
            <div style={s.repTotalLbl}>{dati.count} prenotazioni</div>
          </div>
          <button style={s.waBtn} onClick={esporta}><Download size={15} /> Esporta Excel</button>
        </div>

        <label style={s.label}>Incassi e prenotazioni per campo</label>
        <div style={s.repTable}>
          {FIELDS.map((f) => (
            <div key={f.id} style={s.repRow}>
              <span style={{ ...s.dot, background: f.color }} />
              <span style={{ flex: 1, fontWeight: 600, fontSize: 13.5 }}>{f.name}</span>
              <span style={s.repCount}>{dati.contaCampo[f.id] || 0} pren.</span>
              <span style={{ fontWeight: 700, fontSize: 13.5, minWidth: 70, textAlign: "right" }}>{eur(dati.perCampo[f.id] || 0)}</span>
            </div>
          ))}
        </div>

        <label style={s.label}>Fasce orarie più utilizzate</label>
        <div style={s.repHours}>
          {HOURS.map((h) => {
            const n = dati.perOra[h] || 0;
            return (
              <div key={h} style={s.repHourItem} title={`${n} prenotazioni`}>
                <div style={s.repBarWrap}>
                  <div style={{ ...s.repBar, height: `${(n / maxOra) * 100}%` }} />
                </div>
                <span style={s.repHourLbl}>{String(h).padStart(2, "0")}</span>
              </div>
            );
          })}
        </div>
        {dati.oreOrdinate.length > 0 && (
          <div style={s.repHint}>
            Fascia più richiesta: <b>{String(dati.oreOrdinate[0][0]).padStart(2, "0")}:00</b> ({dati.oreOrdinate[0][1]} prenotazioni).
          </div>
        )}
      </div>
    </div>
  );
}

const globalCss = `
* { box-sizing: border-box; }
body { margin: 0; }
button { font-family: inherit; cursor: pointer; }
input, select, textarea { font-family: inherit; }
::-webkit-scrollbar { height: 8px; width: 8px; }
::-webkit-scrollbar-thumb { background: #D6D3CC; border-radius: 8px; }
`;

const s = {
  app: { fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F5F0", minHeight: "100vh", color: "#0B2545" },
  center: { minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui", color: "#8A867C" },
  loginWrap: { minHeight: "100vh", display: "grid", placeItems: "center", background: "linear-gradient(160deg, #0B2545 0%, #0A1E3D 55%, #071730 100%)", fontFamily: "'Inter', system-ui, sans-serif", padding: 16 },
  loginCard: { background: "#fff", padding: 32, borderRadius: 18, width: "min(380px, 100%)", boxShadow: "0 20px 60px rgba(0,0,0,0.35)", textAlign: "center" },
  loginLogo: { width: 180, maxWidth: "100%", margin: "0 auto 4px", display: "block" },
  loginTitle: { fontSize: 22, fontWeight: 800, margin: "16px 0 2px", letterSpacing: "-0.02em" },
  loginSub: { fontSize: 13.5, color: "#8A867C", margin: "0 0 20px" },
  loginErr: { marginTop: 10, padding: "8px 12px", borderRadius: 9, background: "#FCF1F1", color: "#B4292A", fontSize: 13, fontWeight: 500 },
  loginHint: { fontSize: 11.5, color: "#A8A399", marginTop: 16, lineHeight: 1.5 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "12px 22px", background: "linear-gradient(120deg, #0B2545 0%, #0A1E3D 100%)", borderBottom: "3px solid #38BDF8" },
  headerLogo: { height: 40, display: "block" },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logo: { width: 44, height: 44, borderRadius: 12, background: "#0B2545", color: "#fff", display: "grid", placeItems: "center", margin: "0 auto" },
  brandTitle: { fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em", color: "#fff" },
  brandSub: { fontSize: 12, color: "#9FD3F5", display: "flex", alignItems: "center", gap: 5 },
  searchWrap: { position: "relative", display: "flex", alignItems: "center", flex: "1 1 220px", maxWidth: 340 },
  searchIcon: { position: "absolute", left: 12, color: "#8AAAC7" },
  searchInput: { width: "100%", height: 40, padding: "0 34px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.18)", fontSize: 14, background: "rgba(255,255,255,0.08)", color: "#fff" },
  searchClear: { position: "absolute", right: 8, width: 26, height: 26, borderRadius: 7, border: "none", background: "transparent", color: "#9FD3F5", display: "grid", placeItems: "center" },
  headerIconBtn: { width: 34, height: 34, borderRadius: 9, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)", display: "grid", placeItems: "center", color: "#fff" },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "14px 22px 8px" },
  viewToggle: { display: "flex", background: "#EEEBE4", borderRadius: 10, padding: 3 },
  toggleBtn: { border: "none", background: "transparent", padding: "7px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13.5, color: "#8A867C" },
  toggleActive: { background: "#fff", color: "#0B2545", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
  centerNav: { display: "flex", alignItems: "center", gap: 6 },
  iconBtn: { width: 34, height: 34, borderRadius: 9, border: "1px solid #E2E0DB", background: "#fff", display: "grid", placeItems: "center", color: "#5A574F" },
  todayBtn: { height: 34, padding: "0 14px", borderRadius: 9, border: "1px solid #E2E0DB", background: "#fff", fontWeight: 600, fontSize: 13.5, color: "#0B2545" },
  weekLabel: { fontWeight: 600, fontSize: 14.5, letterSpacing: "-0.01em", marginLeft: 8 },
  addBtn: { display: "inline-flex", alignItems: "center", gap: 7, height: 38, padding: "0 18px", borderRadius: 10, border: "none", background: "#0B2545", color: "#fff", fontWeight: 600, fontSize: 14 },
  revBar: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, margin: "6px 22px 14px", padding: "12px 16px", background: "#fff", border: "1px solid #EAE7E0", borderRadius: 12 },
  revTotals: { display: "flex", gap: 10, flexWrap: "wrap" },
  revCard: { display: "flex", flexDirection: "column", gap: 2, padding: "8px 16px", borderRadius: 10, background: "#F7F5F0", minWidth: 96 },
  revCardMonth: { background: "#0B2545", color: "#fff" },
  revLbl: { fontSize: 11.5, fontWeight: 600, color: "inherit", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.03em" },
  revNum: { fontSize: 19, fontWeight: 800, letterSpacing: "-0.02em" },
  catPanels: { display: "flex", gap: 10, flexWrap: "wrap" },
  catPanel: { border: "1px solid #EAE7E0", borderRadius: 11, padding: "8px 12px", minWidth: 150, background: "#FDFCFA" },
  catHead: { display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: "#3A3830", marginBottom: 6 },
  catRows: { display: "flex", gap: 12 },
  catRow: { display: "flex", flexDirection: "column", gap: 1 },
  catRowLbl: { fontSize: 10.5, fontWeight: 600, color: "#A8A399", textTransform: "uppercase", letterSpacing: "0.03em" },
  catRowVal: { fontSize: 13.5, fontWeight: 700, color: "#0B2545", whiteSpace: "nowrap" },
  dot: { width: 10, height: 10, borderRadius: 3 },
  gridWrap: { padding: "0 22px 30px", overflowX: "auto" },
  grid: { display: "grid", gridTemplateColumns: "56px repeat(7, minmax(120px, 1fr))", background: "#EAE7E0", border: "1px solid #EAE7E0", borderRadius: 14, overflow: "hidden", minWidth: 900 },
  dayGrid: { display: "grid", gridTemplateColumns: "56px repeat(4, minmax(150px, 1fr))", background: "#EAE7E0", border: "1px solid #EAE7E0", borderRadius: 14, overflow: "hidden", minWidth: 720 },
  corner: { background: "#fff", padding: "10px 8px", fontSize: 11, color: "#A8A399", fontWeight: 600, display: "grid", placeItems: "center" },
  dayHead: { background: "#fff", padding: "10px 8px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  dayHeadToday: { background: "#FBF3EC" },
  dayName: { fontSize: 11.5, color: "#8A867C", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" },
  dayNum: { fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" },
  dayNumToday: { background: "#0B2545", color: "#fff", width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 15 },
  dayColName: { fontSize: 13.5, fontWeight: 700, letterSpacing: "-0.01em" },
  hourCell: { background: "#fff", padding: "6px 6px", fontSize: 11, color: "#A8A399", fontWeight: 600, textAlign: "right", borderTop: "1px solid #F0EDE7" },
  slot: { background: "#fff", border: "none", borderTop: "1px solid #F0EDE7", borderLeft: "1px solid #F0EDE7", minHeight: 52, padding: 3, display: "flex", flexDirection: "column", gap: 3, alignItems: "stretch", textAlign: "left" },
  event: { borderRadius: 6, padding: "4px 7px", display: "flex", flexDirection: "column", gap: 1, cursor: "pointer" },
  evTag: { fontSize: 10, fontWeight: 800, letterSpacing: "0.03em" },
  evName: { fontSize: 11.5, fontWeight: 600, color: "#3A3830", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  evMeta: { fontSize: 10.5, color: "#8A867C", fontWeight: 500 },
  overlay: { position: "fixed", inset: 0, background: "rgba(30,28,24,0.45)", display: "grid", placeItems: "center", padding: 16, zIndex: 50 },
  modal: { background: "#fff", borderRadius: 16, padding: 22, width: "min(480px, 100%)", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" },
  label: { display: "block", fontSize: 12.5, fontWeight: 600, color: "#6B675E", margin: "12px 0 6px" },
  fieldPicker: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  fieldChip: { padding: "9px 10px", borderRadius: 9, border: "1.5px solid", fontWeight: 600, fontSize: 13, transition: "all .12s" },
  row: { display: "flex", gap: 10 },
  input: { width: "100%", height: 40, padding: "0 12px", borderRadius: 9, border: "1px solid #E2E0DB", fontSize: 14, background: "#fff", color: "#0B2545" },
  inputIcon: { position: "relative" },
  inputIconSvg: { position: "absolute", left: 11, top: 12, color: "#A8A399" },
  conflict: { display: "flex", alignItems: "flex-start", gap: 8, marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "#FCF1E8", border: "1px solid #F0D4B8", color: "#9A5A18", fontSize: 12.5, lineHeight: 1.4 },
  repeatRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  repeatChip: { padding: "8px 12px", borderRadius: 9, border: "1.5px solid", fontWeight: 600, fontSize: 13, transition: "all .12s" },
  dowRow: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 },
  dowChip: { width: 42, height: 36, borderRadius: 9, border: "1.5px solid", fontWeight: 600, fontSize: 12.5 },
  repeatHint: { fontSize: 12, color: "#9A5A18", marginTop: 6 },
  modalFoot: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 },
  delBtn: { display: "inline-flex", alignItems: "center", gap: 6, height: 38, padding: "0 14px", borderRadius: 10, border: "1px solid #E7C9C9", background: "#FCF1F1", color: "#B4292A", fontWeight: 600, fontSize: 13.5 },
  waBtn: { display: "inline-flex", alignItems: "center", gap: 6, height: 38, padding: "0 14px", borderRadius: 10, border: "none", background: "#25D366", color: "#fff", fontWeight: 600, fontSize: 13.5, textDecoration: "none" },
  searchPage: { padding: "18px 22px 40px" },
  searchHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, fontSize: 14, fontWeight: 600, color: "#6B675E" },
  empty: { padding: "40px 0", textAlign: "center", color: "#A8A399", fontSize: 14 },
  resList: { display: "flex", flexDirection: "column", gap: 8 },
  resItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: "1px solid #EAE7E0", background: "#fff", width: "100%" },
  resTag: { width: 38, height: 38, borderRadius: 9, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12 },
  resName: { fontSize: 14.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  resMeta: { fontSize: 12.5, color: "#8A867C", marginTop: 2 },
  rubricaBtn: { display: "inline-flex", alignItems: "center", gap: 7, height: 40, padding: "0 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)", fontWeight: 600, fontSize: 13.5, color: "#fff" },
  rubricaCount: { display: "inline-grid", placeItems: "center", minWidth: 20, height: 20, padding: "0 6px", borderRadius: 10, background: "#38BDF8", color: "#0B2545", fontSize: 11.5, fontWeight: 700 },
  pickerToggle: { position: "absolute", right: 6, top: 6, width: 28, height: 28, borderRadius: 7, border: "none", background: "transparent", color: "#8A867C", display: "grid", placeItems: "center" },
  dropdown: { position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid #E2E0DB", borderRadius: 11, boxShadow: "0 12px 30px rgba(0,0,0,0.14)", zIndex: 20, overflow: "hidden", maxHeight: 240, overflowY: "auto" },
  dropdownHead: { padding: "8px 12px 4px", fontSize: 11, fontWeight: 700, color: "#A8A399", textTransform: "uppercase", letterSpacing: "0.04em" },
  dropdownItem: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 12px", border: "none", background: "transparent", textAlign: "left" },
  dropAvatar: { width: 30, height: 30, borderRadius: "50%", background: "#EEEBE4", color: "#6B675E", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 },
  dropName: { fontSize: 14, fontWeight: 600, flex: 1 },
  dropPhone: { fontSize: 12.5, color: "#8A867C" },
  rubForm: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
  rubList: { display: "flex", flexDirection: "column", gap: 8, marginTop: 14, maxHeight: 340, overflowY: "auto" },
  rubItem: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 11, border: "1px solid #EAE7E0", background: "#fff" },
  rubEdit: { height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid #E2E0DB", background: "#fff", fontWeight: 600, fontSize: 12.5, color: "#0B2545" },
  rubDel: { width: 32, height: 32, borderRadius: 8, border: "1px solid #E7C9C9", background: "#FCF1F1", color: "#B4292A", display: "grid", placeItems: "center" },
  repTotalCard: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 14, padding: "16px 18px", borderRadius: 12, background: "#0B2545", color: "#fff" },
  repTotalLbl: { fontSize: 12, opacity: 0.7, fontWeight: 500 },
  repTotalNum: { fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "2px 0" },
  repTable: { display: "flex", flexDirection: "column", gap: 2, border: "1px solid #EAE7E0", borderRadius: 11, overflow: "hidden" },
  repRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#fff", borderBottom: "1px solid #F0EDE7" },
  repCount: { fontSize: 12.5, color: "#8A867C", fontWeight: 500, minWidth: 60, textAlign: "right" },
  repHours: { display: "flex", alignItems: "flex-end", gap: 3, height: 90, padding: "0 2px", borderBottom: "1px solid #EAE7E0" },
  repHourItem: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, height: "100%" },
  repBarWrap: { flex: 1, width: "100%", display: "flex", alignItems: "flex-end" },
  repBar: { width: "100%", background: "#1565C0", borderRadius: "3px 3px 0 0", minHeight: 2 },
  repHourLbl: { fontSize: 9, color: "#A8A399", fontWeight: 600 },
  repHint: { fontSize: 12.5, color: "#5A574F", marginTop: 8, padding: "8px 12px", background: "#F7F5F0", borderRadius: 9 },
};
