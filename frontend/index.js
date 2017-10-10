var getRemainingTime = (seconds) => {
    var minutes = Math.floor(seconds / 60);
    var seconds = seconds - (minutes * 60);

    return { minutes: minutes, seconds: seconds };
}

var startCountdown = (container, remainingCooldown) => {
    container.empty();
    var cooldownTimer = setInterval(() => {
        remainingCooldown--;

        var minSecs = getRemainingTime(remainingCooldown);

        container.html(`<b>${minSecs.minutes} minutes ${minSecs.seconds} seconds until you can play again</b>`);
        if(remainingCooldown <= 0)
        {
            clearInterval(cooldownTimer);
            location.reload();
        }
    }, 1000);
}

var addr;
var captchaResp;
var onCaptchaSolve = (resp) => {
    addr = $("#address").val();
    captchaResp = resp;
}

$(document).ready(function() {
    var submitContainer = $("#submitContainer");
    var success = $("#success");
    var error = $("#error");
    var captcha = $("#captcha");

    $.get("api/faucet", (info) => {
        $("#addr").html(info.address);
        $("#ppc").html(info.payPerClick.toFixed(8) + " ARK");
        $("#cooldown").html(info.cooldown + " seconds");

        $.get("api/faucet/status", (data) => {
            if(!data.canRoll)
            {
                var timeDiff = data.timeDiff;
                var remainingCooldown = info.cooldown - timeDiff;

                submitContainer.removeClass("hidden");
                submitContainer.empty();
                
                startCountdown(submitContainer, remainingCooldown);
            }
            else
                submitContainer.removeClass("hidden");
        });

        $("#submit").click(() => {
            if(addr == null || captchaResp == null)
            {
                error.html("Please enter a valid Ark address and solve the captcha");
                error.removeClass("hidden");
                return;
            }

            $.post("api/faucet", {"address": addr, "g-recaptcha-response": captchaResp}, (resp) => {
                error.addClass("hidden");
                success.html(`${info.payPerClick} Ark added to your account!`);
                success.removeClass("hidden");
                startCountdown(submitContainer, info.cooldown);
            }).fail((resp) => {
                var response = JSON.parse(resp.responseText);
                error.html(response.message);
                error.removeClass("hidden");
            });
        });
    });

    $.get("api/faucet/captcha", (resp) => {
        var captchaHtml = $($.parseHTML(resp.captcha, null, true));
        captchaHtml.attr("data-callback", "onCaptchaSolve");
        captcha.html(captchaHtml);
    });

    $.get("api/faucet/logs", (data) => {
        console.log(data);
    });
});