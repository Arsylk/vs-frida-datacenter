# frida-clockwork

 -pkg:com.applovin -pkg:com.google  -pkg:com.facebook -pkg:com.ironsource -pkg:androidx -pkg:com.onesignal -pkg:com.startapp -pkg:com.iab -pkg:kotlin -pkg:com.flurry -pkg:com.yandex -pkg:io.reactive -pkg:com.bytedance -pkg:com.mbridge -pkg:com.inmobi -pkg:com.fyber -pkg:com.tapjoy -pkg:com.adcolony -pkg:com.chartboost -pkg:com.safedk -pkg:com.smaato -pkg:com.vungle -pkg:com.adjust.sdk -pkg:com.anythink -pkg:com.my.target regex:yes src:"([A-Za-z]+://)([-\w]+(?:\.\w[-\w]*)+)(:\d+)?(/[^.!,?"<>\[\]{}\s\x7F-\xFF]*(?:[.!,?]+[^.!,?"<>\[\]{}\s\x7F1-\xFF]+)*)?"

 -pkg:com.applovin -pkg:com.google -pkg:com.facebook -pkg:com.ironsource -pkg:androidx -pkg:com.onesignal -pkg:com.startapp -pkg:com.iab -pkg:kotlin -pkg:com.flurry -pkg:com.yandex -pkg:io.reactive -pkg:com.bytedance -pkg:com.mbridge -pkg:com.inmobi -pkg:com.fyber -pkg:com.tapjoy -pkg:com.adcolony -pkg:com.chartboost -pkg:com.safedk -pkg:com.smaato -pkg:com.vungle -pkg:com.adjust.sdk -pkg:com.anythink -pkg:com.my.target regex:yes src:"\.loadUrl\("

src:"getcookie|csrf|c_user|mnemonic|seed phrase|sec ret phrase" regex:yes

set CMD bat --paging=never session.txt;  bat --style=numbers --paging=never --lines session.txt | fzf --ansi --keep-right  --layout=reverse --preview-window :follow --prompt '> ' --header 'Session logs' --bind "start:reload:$CMD" --bind "change:reload:speed 0.1; $CMD || true" -e -i

bat --style=grid,header-filename,header-filesize session.txt | nl -v -4 -s (set_color black; echo ' │ ') | fzf --ansi -i --track --no-sort --layout=reverse --scrollbar=':' --preview 'printf %s {2} | bat -pp --color=always' --delimiter ' │ ' --preview-window 'hidden' --bind 'f2:change-preview-window(right,40%,border-left,wrap|hidden)' --nth 2.
