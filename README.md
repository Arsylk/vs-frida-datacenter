# frida-clockwork

src:"([A-Za-z]+://)([-\w]+(?:\.\w[-\w]*)+)(:\d+)?(/[^.!,?"<>\[\]{}\s\x7F-\xFF]*(?:[.!,?]+[^.!,?"<>\[\]{}\s\x7F-\xFF]+)*)?" regex:yes -pkg:com.applovin -pkg:com.google  -pkg:com.facebook -pkg:com.ironsource -pkg:androidx -pkg:com.onesignal -pkg:com.startapp -pkg:com.iab -pkg:kotlin -pkg:com.flurry -pkg:com.yandex -pkg:io.reactive -pkg:com.bytedance -pkg:com.mbridge -pkg:com.inmobi


src:"getcookie|csrf|c_user|mnemonic|seed phrase|secret phrase" regex:yes