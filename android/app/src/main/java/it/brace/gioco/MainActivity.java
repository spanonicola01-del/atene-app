package it.brace.gioco;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Brace per Android: mostra a schermo intero il gioco pubblicato sul sito.
 * Il gioco si aggiorna da solo quando cambia il sito; l'APK va reinstallato
 * solo se cambiano icona, nome o questo file.
 */
public class MainActivity extends Activity {

    static final String SITE = "https://spanonicola01-del.github.io/atene-app/brace";
    static final String HOME = SITE + "/";
    static final int BG = Color.parseColor("#14090f");

    static final String OFFLINE =
        "<!doctype html><html lang='it'><head><meta charset='utf-8'>"
        + "<meta name='viewport' content='width=device-width,initial-scale=1'>"
        + "<style>body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;"
        + "background:#14090f;color:#f6e9ea;font:16px system-ui,sans-serif;text-align:center;padding:24px;box-sizing:border-box}"
        + "h1{margin:0;font-size:28px;color:#ff8a4c}p{margin:0;color:#d9c3c9;max-width:30ch;line-height:1.5}"
        + "button{font:700 17px system-ui,sans-serif;color:#fff;border:0;border-radius:999px;padding:15px 34px;"
        + "background:linear-gradient(100deg,#ff8a4c,#ff4f8b)}</style></head><body>"
        + "<h1>Nessuna connessione</h1><p>Brace ha bisogno di internet per aprirsi. Controlla la rete e riprova.</p>"
        + "<button onclick=\"location.href='" + HOME + "'\">Riprova</button></body></html>";

    private WebView web;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(BG);
        getWindow().setNavigationBarColor(BG);

        web = new WebView(this);
        web.setBackgroundColor(BG);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                Uri uri = req.getUrl();
                if (uri.toString().startsWith(SITE)) return false;
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (Exception ignored) {
                }
                return true;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest req, WebResourceError err) {
                if (req.isForMainFrame()) {
                    view.loadDataWithBaseURL(null, OFFLINE, "text/html", "utf-8", null);
                }
            }
        });

        setContentView(web);
        if (state != null) {
            web.restoreState(state);
        } else {
            web.loadUrl(startUrl(getIntent()));
        }
    }

    private String startUrl(Intent intent) {
        Uri data = intent != null ? intent.getData() : null;
        if (data != null && data.toString().startsWith(SITE)) return data.toString();
        return HOME;
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (intent.getData() != null) web.loadUrl(startUrl(intent));
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) {
            web.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
